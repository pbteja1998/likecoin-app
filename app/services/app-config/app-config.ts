import RemoteConfigModule, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config'
import {
  APP_VERSION,
  AUTHCORE_CREDENTIAL_KEY,
  AUTHCORE_ROOT_URL,
  BIG_DIPPER_URL,
  COSMOS_CHAIN_ID,
  COSMOS_LCD_URL,
  COSMOS_DENOM,
  COSMOS_FRACTION_DENOM,
  COSMOS_FRACTION_DIGITS,
  COSMOS_GAS_PRICE,
  IAP_ENABLE,
  IAP_IOS_IS_SANDBOX,
  IAP_IOS_SHARED_SECRET,
  LIKECO_API_URL,
  LIKERLAND_API_URL,
  MIN_VERSION,
  SENTRY_DSN,
  USER_PII_SALT,
} from "react-native-dotenv"

export interface AppConfigParams {
  AUTHCORE_CREDENTIAL_KEY: string
  AUTHCORE_ROOT_URL: string
  BIG_DIPPER_URL: string
  COSMOS_CHAIN_ID: string
  COSMOS_LCD_URL: string
  COSMOS_DENOM: string
  COSMOS_FRACTION_DENOM: string
  COSMOS_FRACTION_DIGITS: string
  COSMOS_GAS_PRICE: string
  IAP_ENABLE: string
  IAP_IOS_IS_SANDBOX: string
  IAP_IOS_SHARED_SECRET: string
  LIKECO_API_URL: string
  LIKERLAND_API_URL: string
  MIN_VERSION: string
  SENTRY_DSN: string
  USER_PII_SALT: string
}

export type AppConfigParamKey = keyof AppConfigParams

export class AppConfig {
  /**
   * The config object
   */
  private config: AppConfigParams

  /**
   * The Firebase Remote Config module
   */
  private remoteConfig: FirebaseRemoteConfigTypes.Module

  constructor() {
    this.config = {
      AUTHCORE_CREDENTIAL_KEY,
      AUTHCORE_ROOT_URL,
      BIG_DIPPER_URL,
      COSMOS_CHAIN_ID,
      COSMOS_DENOM,
      COSMOS_FRACTION_DENOM,
      COSMOS_FRACTION_DIGITS,
      COSMOS_GAS_PRICE,
      COSMOS_LCD_URL,
      IAP_ENABLE,
      IAP_IOS_IS_SANDBOX,
      IAP_IOS_SHARED_SECRET,
      LIKECO_API_URL,
      LIKERLAND_API_URL,
      MIN_VERSION,
      SENTRY_DSN,
      USER_PII_SALT,
    }
    this.remoteConfig = RemoteConfigModule()
  }

  async setup() {
    try {
      await this.remoteConfig.setConfigSettings({
        isDeveloperModeEnabled: __DEV__,
      })
      await this.remoteConfig.fetch()
      await this.remoteConfig.activate()
      const { value: newConfigJSONString } = this.remoteConfig.getValue('api_config')
      let remoteConfig = {}
      try {
        remoteConfig = JSON.parse(newConfigJSONString as string)
      } catch (err) {
        console.error(err)
      }
      this.config = {
        ...this.config,
        ...remoteConfig,
      }
    } catch (err) {
      console.error(err)
    }
  }

  getAllParams() {
    return this.config
  }

  getValue(key: AppConfigParamKey) {
    return this.config[key]
  }

  getIsDeprecatedAppVersion() {
    return parseInt(this.getValue("MIN_VERSION")) > parseInt(APP_VERSION)
  }
}
