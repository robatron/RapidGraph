from distutils.core import *

'''
Now that our Python C module is complete, we need to compile it. The 
easiest way to do so is by using the distutils module. We create a setup.py like so:
from distutils.core import setup, Extension
'''
setup(name = "Salesman",
      version = "1.0",
      ext_modules = [Extension("salesman", ["salesman.c"])])

