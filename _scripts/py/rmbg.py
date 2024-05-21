import sys
import os
from rembg import remove
from PIL import Image
import io

def remove_background(input_path, output_path):
    # Open the input image file
    with open(input_path, 'rb') as input_file:
        input_data = input_file.read()

    # Use rembg to remove the background
    output_data = remove(input_data)

    # Save the output image to the specified output path
    with open(output_path, 'wb') as output_file:
        output_file.write(output_data)

def process_folder(input_folder, output_folder):
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Process each file in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            print(f"Processing {filename}...")
            input_path = os.path.join(input_folder, filename)
            # Create an output path with the same name but as a PNG
            output_path = os.path.join(output_folder, os.path.splitext(filename)[0] + "_nobg.png")
            remove_background(input_path, output_path)

    print("Processing completed for all images.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python rmbg_folder.py <input_folder_path> <output_folder_path>")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]

    process_folder(input_folder, output_folder)
