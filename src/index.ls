require! {
    \atom : { CompositeDisposable}
}

var exec

exec-in-repository = (repository, command, name) ->
    { exec } ?:= require 'child_process'
    options =
        cwd: repository.get-working-directory!
      
    exec command, options, (error, stdout) ->
        if error
          atom.notifications.add-error name,
              dismissable: true
              detail: error
        else
            atom.notifications.add-success name,
                dismissable: true
                detail: stdout

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

exec-in-repo = (command, name) ->>
    if repository = await get-current-repository!
        exec-in-repository repository, command, name
            

module.exports = 
    activate: ->>
        require \atom-package-deps .install 'git-time-metric'
        @disposables = new CompositeDisposable
            ..add atom.commands.add 'atom-workspace',
                'timetracker:status': -> exec-in-repo 'gtm status', 'timetracker:status'
                'timetracker:sync': -> exec-in-repo 'git fetchgtm && git pushgtm', 'timetracker:sync'
                'livescript-ide:push': -> exec-in-repo 'git pushgtm && git push', 'livescript-ide:push'
                'livescript-ide:fetch': -> exec-in-repo 'git fetch && git fetchgtm' 'livescript-ide:fetch'
    
    deactivate: ->
        @disposables?dispose! 
        @disposables = null
      