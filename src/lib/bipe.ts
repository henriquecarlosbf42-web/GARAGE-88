export function tocarBipe() {
  try {
    const AudioContextClasse =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const contexto = new AudioContextClasse();
    const oscilador = contexto.createOscillator();
    const ganho = contexto.createGain();

    oscilador.connect(ganho);
    ganho.connect(contexto.destination);
    oscilador.frequency.value = 880;
    ganho.gain.setValueAtTime(0.25, contexto.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.2);

    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.2);
    oscilador.onended = () => contexto.close();
  } catch {
    // navegador sem suporte a Web Audio -- segue sem som
  }
}
