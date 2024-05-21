import bpy
import math

class Point:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        # self.z = z

class Sphere:
    def __init__(self, name, x, y, z, radius):
        bpy.ops.mesh.primitive_uv_sphere_add()
        self.object = bpy.context.active_object
        self.object.location[0] = x
        self.object.location[1] = y
        self.object.location[2] = z
        self.object.name = name
        self.object.scale = (radius, radius, radius)

    def changeX(x):
        self.object.location[0] = x
