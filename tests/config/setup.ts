import { Config } from '@jest/types'

const setup = async function (globalConfig: Config.GlobalConfig, projectConfig: Config.ProjectConfig) {
  console.log(globalConfig.testPathPattern);
  console.log(projectConfig.cache);
}

export default setup