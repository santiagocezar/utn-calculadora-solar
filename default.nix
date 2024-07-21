let pkgs = import <nixpkgs> {};
in pkgs.mkShell {
  buildInputs = with pkgs; [
  	nodePackages.vscode-langservers-extracted
  	nodePackages.typescript-language-server
  ];
}
