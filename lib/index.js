var CompositeDisposable, exec, execInRepository, getActiveRepository, getCurrentRepository, execInRepo;
CompositeDisposable = require('atom').CompositeDisposable;
execInRepository = function(repository, command){
  var options;
  exec == null && (exec = require('child_process').exec);
  options = {
    cwd: repository.getWorkingDirectory()
  };
  return exec(command, options, function(error, stdout){
    if (error) {
      return console.error(error);
    } else {
      return console.log(stdout);
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
execInRepo = async function(command){
  var repository;
  if (repository = (await getCurrentRepository())) {
    return execInRepository(repository, command);
  }
};
module.exports = {
  activate: function(){
    var x$;
    console.log('ready');
    x$ = this.disposables = new CompositeDisposable;
    x$.add(atom.commands.add('atom-workspace', {
      'timetracker:status': function(){
        return execInRepo('gtm status');
      },
      'timetracker:sync': function(){
        return execInRepo('git fetchgtm && git pushgtm');
      },
      'livescript-ide:push': function(){
        return execInRepo('git pushgtm && git push');
      },
      'livescript-ide:fetch': function(){
        return execInRepo('git fetch && git fetchgtm');
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
