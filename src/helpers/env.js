export default function getEnv(name) {
  return window?.configs?.[name] || import.meta.env[name];
}
