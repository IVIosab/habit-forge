import { habits, entries } from "./api"
import { user, account, session, verification } from "./auth"

export { habits, entries }
export { user, account, session, verification }
export const schema = {
  user,
  account,
  session,
  verification,
  habits,
  entries
}
