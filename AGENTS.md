# Project Architecture Rules

- Public contact form submissions are validated in the browser and database, inserted with the anon client under an insert-only public policy, and read only by signed-in users in the admin inbox; keep message storage out of browser storage.