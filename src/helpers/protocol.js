export default function getProtocol() {
  const url = new URL(document.location.href);
  return url.protocol.slice(0, -1);
}
