This Plugin is Obselete
=======================
This plugin is no longer under active development. I would recommend you look at the excellent [SublimeLinter](https://github.com/SublimeLinter/SublimeLinter) instead. It has many more features, supports other languages, is better tested, etc.

Sublime JSHint
=================

This is a JavaScript linting plugin for Sublime Text 2. It leverages the PhantomJS command line webkit engine to check for javascript errors and code style issues and displays a count of errors and a list that you can use to jump to the lines they occur on.

The Plugin should work on Windows and Mac OSX. Linux will work if you replace the bundled PhantomJS binary (for Mac) with one compiled for your platform.


Installing
----------
*Without Git:* Download the latest source from https://github.com/AdamPflug/Sublime-JSHint and copy the whole directory into the Packages directory.

*With Git:* Clone the repository in your Sublime Text 2 Packages directory, located somewhere in user's "Home" directory:

> git clone git://github.com/AdamPflug/Sublime-JSHint.git


The "Packages" packages directory is located at:

* Windows:
    > %APPDATA%/Sublime Text 2/Packages/
* OS X:
    > ~/Library/Application Support/Sublime Text 2/Packages/
* Linux:
    > ~/.Sublime Text 2/Packages/


Using
-----

* Sublime JSHint runs whenever you save a that is displayed with the JavaScript syntax package. When the error list pops up (similar to the gooAnything window) you can select any of the errors to go to that line, or you can type into the textbox to filter the errors list

Configuring
-----------
_Configuration options will be added in the future._

Roadmap
-------
* Spawn validation process in a separate thread (right now it runs pretty fast, but on large files it will block the UI thread until I do this) 
* Add configuration options the for UI (e.g. enable/disable the error list), as well as options to pass to JSHint.
