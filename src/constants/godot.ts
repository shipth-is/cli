// The Godot major.minor versions the build server has export templates for.
// The server picks the patch, so this list holds no patch numbers - a user can still
// pin one, such as 4.2.1.
//
// This is the fallback. The CLI asks GET /godot/versions for the live list, and only uses
// this one when that call cannot answer. A stale entry here costs nothing until then.
// https://shipth.is/docs/guides/godot-versioning
export const SUPPORTED_GODOT_VERSIONS = ['3.6', '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7']
