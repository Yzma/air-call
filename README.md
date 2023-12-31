# Notes

- React Query Dev Tools are still enabled
  - This allows you to view/modify the cache and observe specific states, such as loading and error
- Clicking the "switches" icon in the top right hand corner will toggle if "invalid" calls are shown or not
  - Some call objects from the API are incomplete. To handle this, after fetching all calls, the returned result is transformed into a separate object with additional properties. One of these properties is called 'isValid,' which returns true if the object contains all the necessary properties; otherwise, it returns false
  - Invalid calls are marked with an exclamation point icon to indicate that the call is invalid on the Inbox page
- Archiving all calls on the inbox page will always attempt to archive all the invalid calls as well, intentionally triggering an error message, as it will also attempt to archive invalid activities
- The number on the phone icon represents a real-time count of inboxed calls on the Footer
  - After archiving/unarchiving a call, you should see the number update to reflect the change
  - This number also updates when the user toggles to view invalid calls, meaning that it should match the exact count of calls in the Inbox tab.
- There is no scroll wheel by design as I'm trying to emulate what it would look like on a mobile device
- The other pages have no functionality and are merely there for display

### Example of a valid activity:

```
  {
    direction: 'inbound',
    from: 100001,
    to: 200002,
    via: 30000003,
    duration: 10,
    is_archived: true,
    call_type: 'answered',
    id: '6393bb7b69073dc45849ca7c',
    created_at: '2022-12-09T22:49:31.911Z',
  }
```

### Example of an invalid activity:

```
  {
    duration: 0,
    is_archived: false,
    id: '639a0f0a328500b1a0fa9bf7',
    created_at: '2022-12-14T17:59:38.665Z',
  }
```
