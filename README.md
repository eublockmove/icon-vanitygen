# icon-vanitygen
ICON Vanity Address Generator for nodejs

## Installation

Simply install through npmjs:

```
$ npm i -g icon-vanitygen
```

### Local installation:
```
$ git clone git@github.com:eublockmove/icon-vanitygen.git && cd icon-vanitygen && npm install
```

## Use

To generate a random address simply run:

```
$ iconvanity
```


To look for a vanity address, simply add an input variable:

```
$ iconvanity -i dadb0d
```

## Notes

Since ICON addresses are Hexes, only numbers 0-9 and letters a-f can be used

The process is **cpu-intensive**! High character count will take a lot more time. For reference, 8 characters took about 25 hours on a 9900k


