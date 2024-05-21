import mkpy.basics as mkpy

# set object's scale, position and rotation

mkpy.cleanSlate()
mkpy.addCube()

so = new Cube()

so.location[2] = -1
so.rotation_euler[0] = radians(45)
so.scale = (2, 4, 2)

# create a random number

def rollDice(sides):
    return random.randint(1, sides)

result = rollDice(6)

# create text to display random number

def createTextObject(textContent, size, rotation, extrusion, alignment):
    print("creating text with textContent=" + textContent)
    bpy.ops.object.text_add(enter_editmode=False, align='WORLD', location=(0, 0, 0))
    textObject = bpy.context.active_object
    textObject.data.body = str(textContent)
    textObject.rotation_euler[0] = radians(rotation)
    textObject.data.extrude = extrusion
    textObject.data.size=size
    textObject.name=textContent
    textObject.data.align_x = alignment
    return textObject

def quickText(textContent):
    bpy.ops.object.text_add(enter_editmode=False, align='WORLD', location=(0, 0, 0))
    textObject = bpy.context.active_object
    textObject.data.body = str(textContent)
    textObject.rotation_euler[0] = radians(90)
    textObject.data.extrude = 0.1
    textObject.data.align_x = 'CENTER'
    return textObject

textObject = createTextObject(str(result), 3, 90, 0.2, 'CENTER')
textObject.location[0]=result

greeting = quickText("hello Conrad")
greeting.location[2]=4

# change the font

textObject.data.font=bpy.data.fonts.load("/System/Library/Fonts/Avenir Next.ttc")
greeting.data.font=bpy.data.fonts.load("/Users/mk/Library/Fonts/Forum-Regular.ttf")

# or

SFHeavy = bpy.data.fonts.load("/Library/Fonts/SF-Pro-Display-Heavy.otf")
bigLetter = createTextObject("Z", 20, 90, 1.0, 'CENTER')
bigLetter.location[1]=10
bigLetter.data.font=SFHeavy

# add a light over the number


def lightTheSpot(spotToLight):
    bpy.ops.object.light_add(type='AREA', radius=1, align='WORLD', location=(0, 0, 0))
    light = bpy.context.active_object
    light.location[2] = 3
    light.location[0] = result
    light.data.energy = 500

lightTheSpot(result)

# create and add material


mat_one = bpy.data.materials.get("Material.001")
#textObject.material_slot_assign(mat_one)
#mat_one.diffuse_color = (0.4,0.7,0.9)
textObject.data.materials.append(mat_one)
#textObject.data.body = str(result)
