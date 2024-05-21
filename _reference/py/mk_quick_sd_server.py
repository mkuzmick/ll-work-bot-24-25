import os, subprocess, time, glob
output_path = '/content/drive/MyDrive/COLAB/colabs/machines_dev/_mk'
username='mk'
password='12345'
NGROK ='mk-dev-sd-server'
version='v1.7.0'

Clear_Log = True
v1_5_model = True
v1_5_inpainting_model = True
F222_model = True
Realistic_Vision_model = True
Realistic_Vision_Inpainting_model = True
DreamShaper_model = True
DreamShaper_Inpainting_model = True
OpenJourney_model = True
Anything_v3_model = True
Inkpunk_Diffusion_model = True
instruct_pix2pix_model = True

v2_1_768_model = True
v2_1_512_model = True
v2_depth_model = True

SDXL_1 = True

# extensions
ControlNet = True
Deforum = False
Regional_Prompter = False
Ultimate_SD_Upscale = False
Openpose_Editor = True
ADetailer = False
AnimateDiff = False
text2video = True
Reactor = False

# Install models from URL (Hugging Face link only) (separate them with comma).
Model_from_URL = ''
Save_a_copy_in_Google_Drive = True
Extensions_from_URL = ''

Extra_arguments = '--disable-model-loading-ram-optimization --opt-sdp-no-mem-attention'

#@markdown mount drive
# save everything
from google.colab import drive
drive.mount('/content/drive')

# set output path
output_path = '/content/drive/MyDrive/' + output_path
root = output_path
!mkdir -p {output_path}/outputs
!mkdir -p {output_path}/models
!mkdir -p {output_path}/ESRGAN
!mkdir -p {output_path}/hypernetworks

# Commented out IPython magic to ensure Python compatibility.

def clear():
    from IPython.display import clear_output; return clear_output()

def fetch_bytes(url_or_path):
    if str(url_or_path).startswith('http://') or str(url_or_path).startswith('https://'):
        from urllib.request import urlopen
        return urlopen(url_or_path)
    return open(url_or_path, 'r')

def packages():
    import sys, subprocess
    return [r.decode().split('==')[0] for r in subprocess.check_output([sys.executable, '-m', 'pip', 'freeze']).split()]

def downloadModel(url):
  if 'huggingface.co' in url:
    filename = url.split('/')[-1]
    filename = filename.removesuffix('?download=true')
    !aria2c --console-log-level=error -c -x 16 -s 16 -k 1M {url}  -o {filename}
  else:
    # civitai
    !aria2c --console-log-level=error -c -x 16 -s 16 -k 1M {url}

def download_models():
#   %cd {root}/stable-diffusion-webui/models/Stable-diffusion
  print('⏳ Downloading models ...')
  if v1_5_model:
    downloadModel('https://huggingface.co/ckpt/sd15/resolve/main/v1-5-pruned-emaonly.ckpt')
  if v1_5_inpainting_model:
    downloadModel('https://huggingface.co/runwayml/stable-diffusion-inpainting/resolve/main/sd-v1-5-inpainting.ckpt')
  if F222_model:
    downloadModel('https://huggingface.co/acheong08/f222/resolve/main/f222.ckpt')

  if Realistic_Vision_model:
    downloadModel('https://huggingface.co/SG161222/Realistic_Vision_V5.1_noVAE/resolve/main/Realistic_Vision_V5.1_fp16-no-ema.safetensors')
  if Realistic_Vision_Inpainting_model:
    downloadModel('https://huggingface.co/SG161222/Realistic_Vision_V5.1_noVAE/resolve/main/Realistic_Vision_V5.1-inpainting.safetensors')

  if DreamShaper_model:
    downloadModel('https://huggingface.co/Lykon/DreamShaper/resolve/main/DreamShaper_8_pruned.safetensors')
  if DreamShaper_Inpainting_model:
    downloadModel('https://huggingface.co/Lykon/DreamShaper/resolve/main/DreamShaper_8_INPAINTING.inpainting.safetensors')

  if OpenJourney_model:
    downloadModel('https://huggingface.co/prompthero/openjourney/resolve/main/mdjrny-v4.ckpt')
  if Anything_v3_model:
    downloadModel('https://huggingface.co/Linaqruf/anything-v3.0/resolve/main/anything-v3-fp16-pruned.safetensors')
  if Inkpunk_Diffusion_model:
    downloadModel('https://huggingface.co/Envvi/Inkpunk-Diffusion/resolve/main/Inkpunk-Diffusion-v2.ckpt')
  if instruct_pix2pix_model:
    downloadModel('https://huggingface.co/timbrooks/instruct-pix2pix/resolve/main/instruct-pix2pix-00-22000.ckpt')

  if v2_1_768_model:
    downloadModel('https://huggingface.co/stabilityai/stable-diffusion-2-1/resolve/main/v2-1_768-ema-pruned.ckpt')
    !wget -nc https://raw.githubusercontent.com/Stability-AI/stablediffusion/main/configs/stable-diffusion/v2-inference-v.yaml -O {root}/stable-diffusion-webui/models/Stable-diffusion/v2-1_768-ema-pruned.yaml

  if v2_1_512_model:
    downloadModel('https://huggingface.co/stabilityai/stable-diffusion-2-1-base/resolve/main/v2-1_512-ema-pruned.ckpt')
    !wget -nc https://raw.githubusercontent.com/Stability-AI/stablediffusion/main/configs/stable-diffusion/v2-inference.yaml -O {root}/stable-diffusion-webui/models/Stable-diffusion/v2-1_512-ema-pruned.yaml

  if v2_depth_model:
    downloadModel('https://huggingface.co/stabilityai/stable-diffusion-2-depth/resolve/main/512-depth-ema.ckpt')
    !wget -nc https://raw.githubusercontent.com/Stability-AI/stablediffusion/main/configs/stable-diffusion/v2-midas-inference.yaml -O {root}/stable-diffusion-webui/models/Stable-diffusion/512-depth-ema.yaml

  if SDXL_1:
    downloadModel('https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors')
    downloadModel('https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors')



  if Model_from_URL:
      for m in Model_from_URL.split(','):
#         %cd {root}/stable-diffusion-webui/models/Stable-diffusion
        downloadModel(m)
        if Save_a_copy_in_Google_Drive and gMode == GDriveSaveMode.Models_only:
#           %cd {output_path}/models
          downloadModel(m)

  # download VAEs
  !aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/stabilityai/sd-vae-ft-ema-original/resolve/main/vae-ft-ema-560000-ema-pruned.ckpt -d {root}/stable-diffusion-webui/models/VAE/ -o vae-ft-ema-560000-ema-pruned.ckpt
  !aria2c --console-log-level=error -c -x 16 -s 16 -k 1M https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.ckpt -d {root}/stable-diffusion-webui/models/VAE/ -o vae-ft-mse-840000-ema-pruned.ckpt

def installxformers():
  #!pip install -q https://github.com/camenduru/stable-diffusion-webui-colab/releases/download/0.0.16/xformers-0.0.16+814314d.d20230118-cp38-cp38-linux_x86_64.whl
  #%pip install --no-deps -q https://github.com/brian6091/xformers-wheels/releases/download/0.0.15.dev0%2B4c06c79/xformers-0.0.15.dev0+4c06c79.d20221205-cp38-cp38-linux_x86_64.whl
#   %pip install -q xformers

def updatePython():
  !python --version > /content/pyversion
  with open('/content/pyversion', 'r') as file:
      if '3.10' in file.read():
        print('Already python 3.10. Skip install.')
        return

  #install python 3.10
  !apt-get update -y
  !apt-get install python3.10

  #change alternatives
  !rm /usr/local/bin/python
  !rm /usr/local/bin/pip
  !sudo apt-get install python3.10-distutils
  !sudo update-alternatives --install /usr/local/bin/python python /usr/bin/python3.10 2
  !wget https://bootstrap.pypa.io/get-pip.py && python get-pip.py

def initSaveGoogleDriveModelOnly():
  # Use config files in google drive
  # ui-config.json
  if not os.path.exists(output_path + '/ui-config.json'):
    print("Create new ui-config.json file.")
    !wget https://github.com/sagiodev/stablediffusion_webui/raw/master/ui-config.json -O {output_path + '/ui-config.json'}
  !ln -s {output_path + '/ui-config.json'} {root}/stable-diffusion-webui/

  # Config.json
  if not os.path.exists(output_path + '/config.json'):
    print("Create new config.json file.")
    !wget https://github.com/sagiodev/stablediffusion_webui/raw/master/config.json -O {output_path + '/config.json'}
  !ln -s {output_path + '/config.json'} {root}/stable-diffusion-webui/

  # styles.csv
  if not os.path.exists(output_path + '/styles.csv'):
    print("Create new styles.csv file.")
    !wget https://raw.githubusercontent.com/sagiodev/stablediffusion_webui/master/styles.csv -O {output_path + '/styles.csv'}
  !ln -s {output_path + '/styles.csv'} {root}/stable-diffusion-webui/



  !ln -s {output_path}/outputs

  # embeddings folder on Google Drive
  !mkdir -p {output_path}/embeddings
  !rm -rf embeddings
  !ln -s {output_path}/embeddings

  # save parameter file in google drive
  if not os.path.exists(output_path + '/params.txt'):
    !touch {output_path + '/params.txt'}
  !ln -s {output_path}/params.txt

  # link all models in the models folder
#   %cd {root}/stable-diffusion-webui/models/Stable-diffusion
  models_in_google_drive = glob.glob(output_path + '/models/*')
  print('Models in Google Drive: %s'%models_in_google_drive)
  for f in models_in_google_drive:
    !ln -s {f}

  # link all upscalers in the model folder
  !mkdir -p {root}/stable-diffusion-webui/models/ESRGAN
#   %cd {root}/stable-diffusion-webui/models/ESRGAN
  upscalers_in_google_drive = glob.glob(output_path + '/ESRGAN/*')
  print('Upscalers in Google Drive: %s'%upscalers_in_google_drive)
  for f in upscalers_in_google_drive:
    !ln -s {f}

  # use lora model folder in google drive
  !mkdir -p {output_path}/Lora
#   %cd {root}/stable-diffusion-webui/models
  !rm -rf Lora
  !ln -s {output_path}/Lora

  # use hypernetwork folder in google drive
  !mkdir -p {output_path}/hypernetworks
#   %cd {root}/stable-diffusion-webui/models
  !rm -rf hypernetworks
  !ln -s {output_path}/hypernetworks

  # use VAE folder in google rive
  !mkdir -p {output_path}/VAE
#   %cd {root}/stable-diffusion-webui/models
  !rm -rf VAE
  !ln -s {output_path}/VAE

  # use ControlNet folder in google rive
  !mkdir -p {output_path}/ControlNet
#   %cd {root}/stable-diffusion-webui/models
  !rm -rf ControlNet
  !ln -s {output_path}/ControlNet




def installControlNet():
  print("Installing ControlNet extension...")
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/Mikubill/sd-webui-controlnet.git
#   %cd {root}/stable-diffusion-webui/extensions/sd-webui-controlnet
  !pip install -r requirements.txt

#   %cd {root}/stable-diffusion-webui/extensions/sd-webui-controlnet/models
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11e_sd15_ip2p.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11e_sd15_shuffle.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11f1e_sd15_tile.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11f1p_sd15_depth.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_canny.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_inpaint.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_lineart.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_mlsd.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_normalbae.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_openpose.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_scribble.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_seg.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15_softedge.pth')
  downloadModel('https://huggingface.co/lllyasviel/ControlNet-v1-1/resolve/main/control_v11p_sd15s2_lineart_anime.pth')
  downloadModel('https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_color_sd14v1.pth')
  downloadModel('https://huggingface.co/TencentARC/T2I-Adapter/resolve/main/models/t2iadapter_style_sd14v1.pth')


  print('Install QR code models...')
  downloadModel('https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/resolve/main/control_v1p_sd15_qrcode_monster.safetensors')
  downloadModel('https://huggingface.co/monster-labs/control_v1p_sd15_qrcode_monster/resolve/main/v2/control_v1p_sd15_qrcode_monster_v2.safetensors')
  downloadModel('https://huggingface.co/Nacholmo/controlnet-qr-pattern-sdxl/resolve/main/automatic1111/control_v01u_sdxl_qrpattern.safetensors')


  print("Install ControlNet SDXL models...")
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/diffusers_xl_canny_full.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/diffusers_xl_depth_mid.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/ip-adapter_xl.pth')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/kohya_controllllite_xl_blur.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/kohya_controllllite_xl_blur_anime.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/kohya_controllllite_xl_scribble_anime.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/sai_xl_recolor_256lora.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/sai_xl_sketch_256lora.safetensors')
  downloadModel('https://huggingface.co/lllyasviel/sd_control_collection/resolve/main/t2i-adapter_diffusers_xl_lineart.safetensors')

  print("Install IP-adapter models...")
  downloadModel('https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter_sd15.safetensors')
  downloadModel('https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus_sd15.safetensors')
  downloadModel('https://huggingface.co/h94/IP-Adapter/resolve/main/models/ip-adapter-plus-face_sd15.safetensors')
  downloadModel('https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid-plusv2_sd15.bin')
  downloadModel('https://huggingface.co/h94/IP-Adapter/resolve/main/sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors')
  downloadModel('https://huggingface.co/h94/IP-Adapter-FaceID/resolve/main/ip-adapter-faceid_sdxl.bin')
  !pip install insightface




  print("ControlNet install completed.")

def installDeforum():
  !git clone https://github.com/deforum-art/deforum-for-automatic1111-webui {root}/stable-diffusion-webui/extensions/deforum
  #!cd {root}/stable-diffusion-webui/extensions/deforum; git checkout c42834645805e0f26172888b29f5a9210063db14
  !apt-get install libvulkan1

def installRegionalPrompter():
  !git clone https://github.com/hako-mikan/sd-webui-regional-prompter {root}/stable-diffusion-webui/extensions/sd-webui-regional-prompter


def installUltimateSDUpscale():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/Coyote-A/ultimate-upscale-for-automatic1111

def installOpenPoseEditor():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/fkunn1326/openpose-editor

def installADetailer():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/Bing-su/adetailer

def installAnimateDiff():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/continue-revolution/sd-webui-animatediff
  # !git checkout b192a2551a5ed66d4a3ce58d5d19a8872abc87ca
#   %cd {root}/stable-diffusion-webui/extensions/sd-webui-animatediff/model
  downloadModel('https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v14.ckpt')
  downloadModel('https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15.ckpt')
  downloadModel('https://huggingface.co/guoyww/animatediff/resolve/main/mm_sd_v15_v2.ckpt')

def installtext2video():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/kabachuha/sd-webui-text2video
#   %mkdir -p {root}/stable-diffusion-webui/models/text2video/t2v
#   %cd {root}/stable-diffusion-webui/models/text2video/t2v
  downloadModel('https://huggingface.co/damo-vilab/modelscope-damo-text-to-video-synthesis/resolve/main/VQGAN_autoencoder.pth')
  downloadModel('https://huggingface.co/damo-vilab/modelscope-damo-text-to-video-synthesis/resolve/main/configuration.json')
  downloadModel('https://huggingface.co/damo-vilab/modelscope-damo-text-to-video-synthesis/resolve/main/open_clip_pytorch_model.bin')
  downloadModel('https://huggingface.co/damo-vilab/modelscope-damo-text-to-video-synthesis/resolve/main/text2video_pytorch_model.pth')

def installReactor():
#   %cd {root}/stable-diffusion-webui/extensions
  !git clone https://github.com/Gourieff/sd-webui-reactor




def applyGitFilemode():
  # git default file mode prevents checkout and fail
  print('Apply git filemode false')
  !cd {root}/stable-diffusion-webui/repositories/k-diffusion;git config core.filemode false
  !cd {root}/stable-diffusion-webui/repositories/stable-diffusion-stability-ai;git config core.filemode false
  !cd {root}/stable-diffusion-webui/repositories/taming-transformers;git config core.filemode false
  !cd {root}/stable-diffusion-webui/repositories/CodeFormer;git config core.filemode false
  !cd {root}/stable-diffusion-webui/repositories/BLIP;git config core.filemode false

def cloneRepositories():
  !git clone https://github.com/crowsonkb/k-diffusion.git {root}/stable-diffusion-webui/repositories/k-diffusion
  !git clone https://github.com/Stability-AI/stablediffusion.git {root}/stable-diffusion-webui/repositories/stable-diffusion-stability-ai
  !git clone https://github.com/CompVis/taming-transformers.git {root}/stable-diffusion-webui/repositories/taming-transformers
  !git clone https://github.com/sczhou/CodeFormer.git {root}/stable-diffusion-webui/repositories/CodeFormer
  !git clone https://github.com/salesforce/BLIP.git {root}/stable-diffusion-webui/repositories/BLIP


def installExtensionsFromURL(urls):
#   %cd {root}/stable-diffusion-webui/extensions
  for url in urls.split(','):
    print("Cloning extension from URL: %s"%url)
    !git clone {url}

def lowRamPatch():
  print('Apply lowram patch')
  !sed -i 's/dict()))$/dict())).cuda()/g'  {root}/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/util.py

def searchAndReplace(filePath, orignalStr, newStr):
  orignalStr = orignalStr.replace('/', '\/')
  newStr = newStr.replace('/', '\/')
  !sed -i 's/{orignalStr}/{newStr}/g' {filePath}


def deleteRepos():
  # delete repository directories in webui
  !rm -rf {root}/stable-diffusion-webui/repositories

updatePython()

!mkdir -p {root}
os.chdir(root)
!apt-get -y install -qq aria2
!pip install pyngrok
!git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui



if gMode == GDriveSaveMode.Everything:
  # delete existing repositories and reclone so the file mode fix can be applied
  # otherwise some will only be cloned in the final launch, causing some to fail to checkout.
  deleteRepos()
  cloneRepositories()
  applyGitFilemode()

# fix torch, torchvision version mismatch error
# !pip install torch==1.13.1+cu117 torchvision==0.14.1+cu117 torchtext==0.14.1 torchaudio==0.13.1 torchdata==0.5.1 --extra-index-url https://download.pytorch.org/whl/cu117

# A1111 first launch
# %cd {root}/stable-diffusion-webui

#!git checkout -f a3ddf464a2ed24c999f67ddfef7969f8291567be
!git checkout -f {version}
!COMMANDLINE_ARGS="--exit"  python launch.py


if gMode == GDriveSaveMode.Models_only:
  initSaveGoogleDriveModelOnly()

download_models()

if ControlNet:
  installControlNet()

if Deforum:
  installControlNet() # Deforum needs controlnet to work now
  installDeforum()

if Regional_Prompter:
  installRegionalPrompter()

if Ultimate_SD_Upscale:
  installUltimateSDUpscale()

if Openpose_Editor:
  installOpenPoseEditor()

if ADetailer:
  installADetailer()

if AnimateDiff:
  installAnimateDiff()

if text2video:
  installtext2video()

if Reactor:
  installReactor()




installExtensionsFromURL(Extensions_from_URL)

# downgrade httpx to avoid TypeError: AsyncConnectionPool.__init__() got an unexpected keyword argument 'socket_options'
!pip install httpx==0.24.1

# clear output
if Clear_Log:
  clear()




if  gMode != GDriveSaveMode.Everything:
   lowRamPatch()

# %cd {root}/stable-diffusion-webui
args = f'--gradio-img2img-tool color-sketch --enable-insecure-extension-access --gradio-queue'

if NGROK:
  args += f' --ngrok {NGROK} '
else:
  args += ' --share '
if username and password:
  args += f' --gradio-auth {username}:{password} '
args+= ' '+Extra_arguments
print(f'WEBUI ARGUMENTS: {args}')
!python {root}/stable-diffusion-webui/launch.py {args}
