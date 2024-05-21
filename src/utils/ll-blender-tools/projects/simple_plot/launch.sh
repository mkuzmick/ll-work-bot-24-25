#! /usr/bin/env zsh

# declare project, script and project folder
PROJECT_FOLDER="$HOME/Development/the-blender-tools/projects/simple_plot"
PYTHON_SCRIPT="$PROJECT_FOLDER/main_script.py"
PROJECT="simple_plot"

# declare render and blender project folders
BLENDER_WORK_FOLDER="$HOME/Documents/_blender/_bpy/projects/$PROJECT"
RENDER_FOLDER="$HOME/Documents/_blender/_bpy/renders/$PROJECT"
CURRENT_TIME=$(date "+%Y%m%d%H%M%S")
OUTPUT_PATH="$BLENDER_WORK_FOLDER/$PROJECT-$CURRENT_TIME.blend"
RENDER_PATH_STEM="$RENDER_FOLDER/$PROJECT-render-$CURRENT_TIME-"

# create folders if they don't exist
if [[ ! -e $BLENDER_WORK_FOLDER ]]; then
    mkdir $BLENDER_WORK_FOLDER
elif [[ ! -d $BLENDER_WORK_FOLDER ]]; then
    echo "$BLENDER_WORK_FOLDER already exists but is not a directory" 1>&2
fi
if [[ ! -e $RENDER_FOLDER ]]; then
    mkdir $RENDER_FOLDER
elif [[ ! -d $RENDER_FOLDER ]]; then
    echo "$RENDER_FOLDER already exists but is not a directory" 1>&2
fi

# run blender in the background, passing in output paths and other variables
/Applications/Blender.app/Contents/MacOS/blender --background --python $PYTHON_SCRIPT --  --OUTPUT_PATH="$OUTPUT_PATH" --RENDER_PATH="$RENDER_PATH_STEM" --FINNHUB_APIKEY=$FINNHUB_APIKEY

# open file if desired
open -a "/Applications/Blender.app" "$OUTPUT_PATH"
