import bpy
import os
import random

def test():
    print("mkpy basics loaded")

def cleanSlate():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)


class Cube():
    bpy.ops.mesh.primitive_cube_add()
    this.obj = bpy.context.active_object
    # return so
