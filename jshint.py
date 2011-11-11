import sublime, sublime_plugin
import subprocess
import os, os.path, sys
import functools
import time
import json

package_dir = os.path.abspath(os.path.dirname(__file__))

class JSLintCommand(sublime_plugin.EventListener):
	def __init__(self):
		self.proc = None
		self.lastSaveTime = 0
		self.outputPanel = None
	def on_post_save(self, view):
		if "javascript" not in view.settings().get("syntax").lower():
			return # Do nothing if this isn't a javascript file

		# Initial UI state
		view.set_status("JSHint", "JSHint: Evaluating")

		# Run JS Hint tool
		phantomExecutable = 'phantomjs'
		if self.proc and self.proc.poll() == None:
			self.proc.kill()
			self.proc = None
		if os.name == 'nt':
			startupinfo = subprocess.STARTUPINFO()
			startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
			phantomExecutable = 'phantomjs.exe'
		self.proc = subprocess.Popen([os.path.join(package_dir, phantomExecutable), "run.js", "-j", view.file_name()], stdout=subprocess.PIPE, cwd=package_dir, startupinfo=startupinfo)
		jsonStr, errorStr = self.proc.communicate()

		# Parse Hint Results
		if len(jsonStr) < 1:
			return
		results = json.loads(jsonStr)
		if results["count"] == 1:
			countString = str(results["count"])+" Error"
		else:
			countString = str(results["count"])+" Errors"
		errorStrings = []
		for error in results["errors"]:
			errorStrings.append("Line "+str(error["line"])+": "+error["reason"])

		# Update UI
		view.set_status("JSHint", "JSHint: "+countString)
		sublime.set_timeout(functools.partial(self.clear_status, view), 4000)
		view.window().show_quick_panel(errorStrings, functools.partial(self.select_error, view, results["errors"]))
	def clear_status(self, view):
		if time.time() - self.lastSaveTime >= 4:
			view.erase_status("JSHint")
	def select_error(self, view, errors, selectedIndex):
		if selectedIndex > -1 and selectedIndex < len(errors):
			pt = view.text_point(errors[selectedIndex]['line']-1, 0)
			view.sel().clear()
			view.sel().add(sublime.Region(pt))
			view.show(pt)
