var CompositeDisposable, exec, execInRepository, getActiveRepository, getCurrentRepository, execInRepo;
CompositeDisposable = require('atom').CompositeDisposable;
execInRepository = function(repository, command, name){
  var options;
  exec == null && (exec = require('child_process').exec);
  options = {
    cwd: repository.getWorkingDirectory()
  };
  return exec(command, options, function(error, stdout){
    if (error) {
      return atom.notifications.addError(name, {
        dismissable: true,
        detail: error
      });
    } else {
      return atom.notifications.addSuccess(name, {
        dismissable: true,
        detail: stdout
      });
    }
  });
};
getActiveRepository = function(){
  var editor, activePath, directories, directory, this$ = this;
  if (editor = atom.workspace.getActiveTextEditor()) {
    activePath = editor.getPath();
    directories = atom.project.getDirectories().filter(function(it){
      return it.contains(activePath);
    });
    if (directory = directories[0]) {
      return atom.project.repositoryForDirectory(directory);
    }
  }
};
getCurrentRepository = async function(){
  var repository;
  repository = (await getActiveRepository());
  if (!repository) {
    repository = atom.project.getRepositories()[0];
  }
  return repository;
};
execInRepo = async function(command, name){
  var repository;
  if (repository = (await getCurrentRepository())) {
    return execInRepository(repository, command, name);
  }
};
module.exports = {
  activate: async function(){
    var x$;
    require('atom-package-deps').install('livescript-ide-timetracker');
    x$ = this.disposables = new CompositeDisposable;
    x$.add(atom.commands.add('atom-workspace', {
      'timetracker:status': function(){
        return execInRepo('gtm status', 'timetracker:status');
      },
      'timetracker:sync': function(){
        return execInRepo('git fetchgtm && git pushgtm', 'timetracker:sync');
      },
      'timetracker:merge': function(){
        return execInRepo('git fetch origin refs/notes/gtm-data:refs/notes/origin/gtm-data && git notes --ref gtm-data merge -v origin/gtm-data && git pushgtm');
      },
      'livescript-ide:push': function(){
        return execInRepo('git pushgtm && git push', 'livescript-ide:push');
      },
      'livescript-ide:fetch': function(){
        return execInRepo('git fetch && git fetchgtm', 'livescript-ide:fetch');
      }
    }));
    return x$;
  },
  deactivate: function(){
    var ref$;
    if ((ref$ = this.disposables) != null) {
      ref$.dispose();
    }
    return this.disposables = null;
  }
};
//# sourceMappingURL=/home/bartek/Projekty/atom/livescript-ide/timetracker/lib/index.js.map
