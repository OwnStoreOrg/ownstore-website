const { readdirSync } = require('fs')
const process = require('process')
const path = require('path')

/*
  Returns absolute file path of the given path.
*/
const getAbsPath = dirPath => {
  const extendedPath = typeof dirPath === 'string' ? [dirPath] : dirPath
  return path.resolve(process.cwd(), ...extendedPath)
}

/*
  Returns whether a path/dir is hidden or not.
  isHiddenPath('.next') will return true
*/
const isHiddenPath = path => {
  return /(^|\/)\.[^\/\.]/g.test(path)
}

/*
  Returns sub-directories of the source you provide.

  Usage:
    getSubDirectories(getAbsPath('app'))

    Returns: [
        'api',
        'assets',
        'components',
        'constants',
        'helpers',
        'hooks',
        'pages'
      ]

  Leaves out hidden directories such '.next' and files 'tsconfig.json'
*/
const getSubDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => {
      return dirent.isDirectory() && !isHiddenPath(dirent.name)
    })
    .map(dirent => dirent.name)

module.exports = {
  getAbsPath,
  getSubDirectories,
}
