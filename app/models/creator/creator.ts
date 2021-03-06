import {
  flow,
  Instance,
  SnapshotOut,
  types,
} from "mobx-state-tree"

import { withEnvironment } from "../extensions"
import { UserModel } from "../user"

import { UserResult } from "../../services/api"
import { logError } from "../../utils/error"

/**
 * Content creator model
 */
export const CreatorModel = UserModel
  .named("Creator")
  .props({
    hasCached: types.optional(types.boolean, false)
  })
  .extend(withEnvironment)
  .volatile(() => ({
    hasFetchedDetails: false,
    isFetchingDetails: false,
  }))
  .views(self => ({
    get isLoading() {
      return !self.hasCached && self.isFetchingDetails
    },
  }))
  .actions(self => ({
    fetchDetails: flow(function * () {
      if (self.isFetchingDetails) return
      self.isFetchingDetails = true
      try {
        const result: UserResult = yield self.env.likeCoAPI.fetchUserInfoById(self.likerID)
        switch (result.kind) {
          case "ok": {
            const {
              displayName,
              avatar: avatarURL,
              cosmosWallet,
            } = result.data
            self.hasCached = true
            self.displayName = displayName
            self.avatarURL = avatarURL
            self.cosmosWallet = cosmosWallet
            break
          }
        }
      } catch (error) {
        logError(error.message)
      } finally {
        self.hasFetchedDetails = true
        self.isFetchingDetails = false
      }
    }),
  }))

type CreatorType = Instance<typeof CreatorModel>
export interface Creator extends CreatorType {}
type CreatorSnapshotType = SnapshotOut<typeof CreatorModel>
export interface CreatorSnapshot extends CreatorSnapshotType {}
