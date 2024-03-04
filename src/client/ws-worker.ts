const ws = new WebSocket("ws://localhost:3000/stream");

const ports = new Set<WeakRef<MessagePort>>();

const pub = (type: string, message: any) => {
  ports.forEach((port) => {
    const _port = port.deref();
    if (_port == null) {
      ports.delete(port);
      return;
    }
    _port.postMessage({
      type,
      message
    });
  });
}

addEventListener("connect", ((e: MessageEvent) => {
  const port = e.ports[0];
  ports.add(new WeakRef(port));
  port.postMessage({
    type: "open",
    message: "",
  });
}) as any)

ws.addEventListener("message", (e) => {
  pub(e.type, e.data);
});

ws.addEventListener("close", (e) => {
  pub(e.type, "");
});
