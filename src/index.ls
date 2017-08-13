require! {
    \atom : { CompositeDisposable}
}

var exec

exec-in-repository = (repository, command) ->
    { exec } ?:= require 'child_process'
    options =
        cwd: repository.get-working-directory!
      
    exec command, options, (error, stdout) ->
        if error
            console.error error
        else
            console.log stdout

get-active-repository = ->
    if editor = atom.workspace.get-active-text-editor!
        active-path = editor.get-path!
        directories = atom.project.get-directories!filter (.contains active-path)
        if directory = directories.0
            atom.project.repository-for-directory directory

get-current-repository = ->>
    repository = await get-active-repository!
    unless repository
        repository = atom.project.get-repositories!0
    repository

exec-in-repo = (command) ->>
    if repository = await get-current-repository!
        exec-in-repository repository, command
            

module.exports = 
    activate: ->
        console.log \ready
        @disposables = new CompositeDisposable
            ..add atom.commands.add 'atom-workspace',
                'timetracker:status': -> exec-in-repo 'gtm status'
                'timetracker:sync': -> exec-in-repo 'git fetchgtm && git pushgtm'
                'livescript-ide:push': -> exec-in-repo 'git pushgtm && git push'
                'livescript-ide:fetch': -> exec-in-repo 'git fetch && git fetchgtm'
    
    deactivate: ->
        @disposables?dispose! 
        @disposables = null
      