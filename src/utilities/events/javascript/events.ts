const eventEl = window
const crawlEl = document.querySelector('html')

type EventElement = Element & { _eventIsInitialised?: boolean }

type EventEntry = {
  eventIsBound: boolean
  callbackWrapper?: (event: CustomEvent) => void
  callbackString?: string
  data?: any
}

type EventStore = {
  [key: string]: EventEntry
}

const store = new Proxy<EventStore>(
  {},
  {
    set: (obj, prop: string, value) => {
      const oldState = obj[prop]
      obj[prop] = value
      if (oldState?.data && value.eventIsBound && !oldState?.eventIsBound)
        _Events.$trigger(prop, oldState.data)

      return true
    },
  },
)

class Events {
  _logging = false

  get logging() {
    return this._logging
  }

  set logging(boolean) {
    this._logging = boolean
  }

  constructor() {
    this._logging = false
    readAndBindEventsFromDOM()
  }

  $on<T>(event: string, callback: (event: CustomEvent, data: T, currentTarget?: Element) => void) {
    // Remove if duplicate event is detected
    if (store[event]?.callbackString === callback.toString())
      eventEl.removeEventListener(event, store[event].callbackWrapper!, false)

    const callbackWrapper = (ev: CustomEvent<T>) =>
      callback(
        ev,
        extractPropFromObject(ev.detail, 'data'),
        extractPropFromObject(ev.detail, 'currentTarget'),
      )

    eventEl.addEventListener(event, callbackWrapper)

    if (this.logging) {
      console.log('Listening to event', '--- Name:', event, '--- Callback:', callback)
    }

    store[event] = {
      eventIsBound: true,
      callbackString: callback.toString(),
      callbackWrapper,
    }
  }

  $trigger<T>(event: string, data?: T, currentTarget?: Element) {
    const _data = currentTarget ? { currentTarget, data } : data
    const _event = new CustomEvent(event, { detail: _data })

    if (typeof store[event] === 'undefined')
      store[event] = {
        eventIsBound: false,
        data,
      }

    if (store[event].eventIsBound) {
      if (this.logging) {
        console.log(
          'Event triggered',
          '--- Name:',
          event,
          '--- Params:',
          data,
          '--- currentTarget',
          currentTarget,
        )
      }
      eventEl.dispatchEvent(_event)
    }
  }
}

const _Events = new Events()

_Events.$on('events::dom-reinit', () => readAndBindEventsFromDOM())

/*
 * Private methods
 */

/**
 * Parse DOM and scan for attributes starting with on:
 * These are than passed to bindEvent.
 */
function readAndBindEventsFromDOM() {
  if (!crawlEl) {
    return
  }
  // Elements that have attributes starting with on:
  const elements = _domFind(
    crawlEl,
    (element: Element) =>
      element.attributes &&
      [...element.attributes].some(attr => attr.nodeName.substr(0, 3) === 'on:'),
  )

  elements.map((el: EventElement) => {
    if (!el._eventIsInitialised) {
      const attrs = [...el.attributes]
      attrs
        // Filter attributes (so not elements this time) starting with on:
        .filter(attr => attr.name.slice(0, 3) === 'on:')
        // Listen to the native event.
        .map(attr => bindEvent(attr.ownerElement, attr.name, attr.value))
      el._eventIsInitialised = true
    }
  })
}

/**
 * Bind events
 */
function bindEvent(targetEl: EventElement | null, attrName: string, attrValue: string) {
  // Split on dot and colon.
  const attrs = attrName.split(/on:|\./)
  const nativeEvent = attrs[1]
  const modifiers = attrs.splice(1)
  const [eventToTrigger, eventData] = parseEventString(attrValue)

  // Filters out only the clicked element, based on event attribute.
  const delegateFilter = (el: EventElement) => el === targetEl

  eventEl.addEventListener(
    nativeEvent,
    _delegate(delegateFilter, (e: Event) => {
      runModifiers(modifiers, e)
      _Events.$trigger(eventToTrigger, eventData, targetEl || undefined)
    }),
  )
}

function runModifiers(modifiers: string[], e: Event) {
  modifiers.map(modifier => {
    if (modifier === 'prevent' || modifier === 'preventDefault') {
      e.preventDefault()
    }
    if (modifier === 'stop' || modifier === 'stopPropagation') {
      e.stopPropagation()
    }
  })
}

function parseEventString(eventString: string) {
  const eventStringSplitted = eventString.split(new RegExp(/\(|\)/g))
  return [eventStringSplitted[0], eventStringSplitted[1]]
}

/* DOM and Event helpers */
/**
 * Event delegation. Bind clicks on parent, for live elements,
 * on event traverse up the DOM to find the clicked parent if present.
 */
function _delegate(
  criteria: (element?: EventTarget | EventElement | null) => boolean,
  callback: (e: Event) => void,
) {
  return function (e: Event) {
    let el = e.target as (Node & ParentNode) | null | undefined
    if (criteria(el)) {
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      callback.apply(this, arguments)
    }
    while ((el = el?.parentNode)) {
      if (criteria(el)) {
        // @ts-ignore
        e.delegateTarget = el
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params
        callback.apply(this, arguments)
        return
      }
    }
  }
}

/**
 * Treewalker to match elements based on a function
 */
function _domFind(
  element: Element,
  predicate: (element: Element) => boolean,
  results: Element[] = [],
) {
  if (!element.children) return results
  if (predicate(element)) results.push(element)
  if (element.children && element.children.length)
    [...element.children].map(child => _domFind(child, predicate, results))
  return results
}

/**
 * Extracts and returns specific properties from an given object
 */
function extractPropFromObject(object: Record<string, any>, propName: string) {
  return object && object[propName] ? object[propName] : null
}

export default _Events
