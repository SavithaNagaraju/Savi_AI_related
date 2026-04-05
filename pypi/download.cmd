set PYTHON_VERSION=3.13

uvx pip download -r requirements.txt ^
  --python-version %PYTHON_VERSION% ^
  --platform manylinux2014_x86_64 ^
  --implementation cp ^
  --abi cp313 ^
  --only-binary=:all: ^
  -d .packages/

uvx pip download -r requirements.txt ^
  --python-version %PYTHON_VERSION% ^
  --platform win_amd64 ^
  --abi cp313 ^
  --only-binary=:all: ^
  -d .packages/