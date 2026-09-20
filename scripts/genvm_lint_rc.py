"""Temporary upstream compatibility wrapper for GenVM v0.3.

genvm-linter 0.11.1-rc.2 validates the v0.3 SDK but its nondeterminism
reachability table omits the renamed safe custom-validator entrypoint,
``gl.vm.run_nondet_default``. Extend that table without modifying the installed
package. Remove this wrapper when an upstream release recognizes the entrypoint.
"""

from genvm_linter.lint import safety


safety.SafeEntryPointFinder.SAFE_PATTERNS["gl.vm.run_nondet_default"] = [0, 1]
safety.NONDET_SPAWN_CALLS = safety.NONDET_SPAWN_CALLS | {
    "gl.vm.run_nondet_default"
}

from genvm_linter.cli import main


if __name__ == "__main__":
    main()
