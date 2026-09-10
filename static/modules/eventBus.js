const listeners = new Map(); // event -> Set(handler, handler)

export function on(event, handler) {
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(handler);
    return () => listeners.get(event).delete(handler);
}

export function emit(event, payload) {
    listeners.get(event)?.forEach(handler => handler(payload));
}