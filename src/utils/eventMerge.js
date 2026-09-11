export function mergeEvents(
  initialEvents,
  storedEvents,
  deletedIds,
  options = {}
) {
  const { preferInitial = false } = options;

  if (!Array.isArray(storedEvents) || storedEvents.length === 0) {
    return initialEvents.filter(event => !deletedIds.has(event.id));
  }

  const cleanStored = storedEvents.filter(event => {
    if (!event || !event.id || deletedIds.has(event.id)) return false;

    const title = (event.title || "").toLowerCase();
    const titleTe = event.titleTe || "";
    const description = (event.description || "").toLowerCase();

    return (
      !title.includes("independence") &&
      !titleTe.includes("స్వాతంత్ర్య") &&
      !description.includes("independence")
    );
  });

  const storedMap = new Map(
    cleanStored.map(event => [event.id, event])
  );

  const mergedInitial = initialEvents
    .filter(event => !deletedIds.has(event.id))
    .map(event => {
      if (!storedMap.has(event.id)) {
        return event;
      }

      const stored = storedMap.get(event.id);

      /*
       * When the fresh source is Supabase, it is authoritative.
       *
       * This is especially important for image deletion:
       *
       * Supabase:
       *   images: []
       *   image_url: ""
       *
       * must NOT be overwritten by an old localStorage copy
       * containing the deleted image URL.
       */
      if (preferInitial) {
        return event;
      }

      return {
        ...stored,

        // Canonical notification fields from initialEvents
        // are ALWAYS authoritative.
        startTime:
          event.startTime !== undefined
            ? event.startTime
            : null,

        notificationEligible:
          event.notificationEligible !== undefined
            ? event.notificationEligible
            : true,

        isCancelled:
          event.isCancelled !== undefined
            ? event.isCancelled
            : false,
      };
    });

  const initialIds = new Set(
    initialEvents.map(event => event.id)
  );

  /*
   * Keep local-only custom events.
   * These may exist locally before cloud synchronization.
   */
  const customEvents = cleanStored.filter(
    event => !initialIds.has(event.id)
  );

  return [...mergedInitial, ...customEvents];
}