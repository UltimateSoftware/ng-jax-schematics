# ng-jack

Library of testing things.

## Usage

[in-progress] `npm install ng-jack-schematics --save-dev`


## Schematics
-------

Pop into the schematics folder!

```
cd schematics
```

### Develop
To begin developing schematics on this project, run the follow command:

```
npm run setup
```

This will run `npm install` for the schematics & tour-of-heroes project.

Next, run the following command to link the schematics project to the tour-of-heroes project.

```
npm run link:schematic
```

After that, you should be good to go!

### Test your schematics!
In order to test out the new schematics you built, you must run:

```
npm run test:schematic
```

