// page.js
// Netflix Advanced Shortcuts
(function () {
  const log = (...a) => console.log("[NAS]", ...a);
  const warn = (...a) => console.warn("[NAS]", ...a);

  const norm = (s) => (s || "").toLowerCase();
  function isTextTrack(t) {
    const raw = (t.rawTrackType || "").toUpperCase();
    return ["CLOSEDCAPTIONS","SUBTITLES","SUBTITLE"].includes(raw);
  }
  function isLang(t, codes) {
    const lang = norm(t.bcp47 || t.language || t.lang);
    return !!lang && codes.some(c => lang === c || lang.startsWith(c + "-"));
  }
  function scoreTrack(t, preferredRawType) {
    let s = 0;
    if ((t.rawTrackType || "").toUpperCase() === preferredRawType) s += 100;
    if ((t.trackType || "").toUpperCase() === "ASSISTIVE") s += 10;
    if (/(cc|closed captions)/i.test(t.displayName || "")) s += 1;
    return s;
  }
  function pickEnglishTrack(tracks) {
    const candidates = (tracks || []).filter(t =>
      !t.isNoneTrack && !t.isForcedNarrative && isTextTrack(t) && isLang(t, ["en"])
    );
    if (!candidates.length) return null;
    candidates.sort((a, b) =>
      scoreTrack(b, "CLOSEDCAPTIONS") - scoreTrack(a, "CLOSEDCAPTIONS")
    );
    return candidates[0];
  }
  function pickPortugueseTrack(tracks) {
    const candidates = (tracks || []).filter(t =>
      !t.isNoneTrack && !t.isForcedNarrative && isTextTrack(t) && isLang(t, ["pt"])
    );
    if (!candidates.length) return null;
    candidates.sort((a, b) =>
      scoreTrack(b, "SUBTITLES") - scoreTrack(a, "SUBTITLES")
    );
    return candidates[0];
  }

  const poll = setInterval(() => {
    try {
      if (!window.netflix || !window.netflix.appContext) return;

      const vpAPI = window.netflix.appContext?.state?.playerApp?.getAPI?.().videoPlayer;
      if (!vpAPI) return;

      const sessionId = vpAPI.getAllPlayerSessionIds?.()
        ?.find((id) => typeof id === "string" && id.includes("watch"));
      if (!sessionId) return;

      const player = vpAPI.getVideoPlayerBySessionId?.(sessionId);
      if (!player) return;

      clearInterval(poll);
      log("✅ Netflix Player detectado — atalhos ativos (W e Q).");

      const handler = (e) => {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || e.isComposing) return;

        // W: retrocede 5s
        if (e.key === "w" || e.keyCode === 87) {
          e.stopImmediatePropagation();
          e.preventDefault();
          const t = Math.max(0, player.getCurrentTime() - 5000);
          player.seek(t);
          log(`⏪ −5s → ${(t / 1000).toFixed(1)}s`);
        }

        // Q: regra solicitada
        // Se player estiver pausado => próxima trilha será EN e fica em play
        // Se player estiver tocando => próxima trilha será PT e fica em pause
        if (e.key === "q" || e.keyCode === 81) {
          e.stopImmediatePropagation();
          e.preventDefault();

          const tracks = player.getTextTrackList?.() || [];
          const pt = pickPortugueseTrack(tracks);
          const en = pickEnglishTrack(tracks);

          if (!pt || !en) {
            warn("❗️Legendas PT/EN não encontradas.", { hasPT: !!pt, hasEN: !!en, tracks });
            return;
          }

          const paused = player.isPaused?.();
          if (paused === true) {
            // Vai para INGLÊS e dá PLAY
            player.setTextTrack(en);
            try { player.play?.(); } catch {}
            log("📝 Legenda: Inglês (CC prioritário) | ▶️ Play");
          } else if (paused === false) {
            // Vai para PORTUGUÊS e dá PAUSE
            player.setTextTrack(pt);
            try { player.pause?.(); } catch {}
            log("📝 Legenda: Português | ⏸️ Pause");
          } else {
            // fallback se API não retornou booleano: alterna por track atual
            const current = player.getTextTrack?.();
            const sameById = (a, b) => a && b && a.trackId && b.trackId && a.trackId === b.trackId;
            const showingPT = sameById(current, pt);
            player.setTextTrack(showingPT ? en : pt);
            try { player[showingPT ? 'play' : 'pause']?.(); } catch {}
            log(`📝 Legenda: ${showingPT ? "Inglês (CC prioritário) | ▶️ Play" : "Português | ⏸️ Pause"}`);
          }
        }
      };

      document.body.addEventListener("keyup", handler, { capture: true });
      window.addEventListener("unload", () => {
        document.body.removeEventListener("keyup", handler, { capture: true });
      });
    } catch (err) {
      warn("Erro no polling:", err);
    }
  }, 500);
})();
