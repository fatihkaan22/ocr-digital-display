from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from toolz.curried import *
import requests
from io import BytesIO
from PIL import Image
import os
from object_detection.utils import label_map_util 
import tensorflow as tf

WORKSPACE_NAME = 'merge_v1'
MODEL_NAME = 'efficientdet_d1_coco17_tpu-32'

MOUNT_POINT = '/home/jupyter'
TENSORFLOW = os.path.join(MOUNT_POINT,'cse496','Tensorflow')
NOTEBOOK_WS = os.path.join(TENSORFLOW,'workspace',WORKSPACE_NAME)
GIT = os.path.join(MOUNT_POINT, 'ocr-digital-display')
DS = os.path.join(MOUNT_POINT, 'ds')

paths = {
  'workspace': os.path.join(NOTEBOOK_WS),
  'labelmap': os.path.join(GIT,'tensorflow','label_map.pbtxt'),
  'models': os.path.join(TENSORFLOW,'models'),
  'train_record': os.path.join(DS,'train.record'),
  'test_record': os.path.join(DS,'test.record'),
  'scripts': os.path.join(TENSORFLOW,'scripts'),
  'pre_trained_models': os.path.join(TENSORFLOW,'pre-trained-models'),
  'pre_trained_model': os.path.join(TENSORFLOW,'pre-trained-models',MODEL_NAME),
  'model': os.path.join(NOTEBOOK_WS,'models',MODEL_NAME),
  'pipeline': os.path.join(NOTEBOOK_WS,'models',MODEL_NAME,'pipeline.config'),
  'train_script': os.path.join(TENSORFLOW,'models','research','object_detection','model_main_tf2.py'),
  'export_script': os.path.join(TENSORFLOW,'models','research','object_detection','exporter_main_v2.py'),
  'exported_models': os.path.join(NOTEBOOK_WS,'exported_models'),
  'exported_model': os.path.join(NOTEBOOK_WS,'exported_models',MODEL_NAME),
}

category_index = label_map_util.create_category_index_from_labelmap(paths['labelmap'], use_display_name=True)

def get_bytes(url):
    response = requests.get(url)
    return BytesIO(response.content)

def load_image_into_numpy_array(path):
  return pipe(
      path,
      Image.open,
      lambda x: x.convert('RGB'),
      np.array,
  )

def detect(image_path):
  return pipe(
      image_path,
      load_image_into_numpy_array,
      lambda im: pipe(
        im,
        tf.convert_to_tensor,
        lambda x: x[tf.newaxis, ...],
        #lambda x: print(x.shape)
        detect_fn,
        lambda detections: merge(detections, {'image': im})
      )
  )

def get_imgs(path):
    return pipe(
        os.path.join(path),
        os.listdir,
        map(lambda x: os.path.join(path,x)),
        filter(lambda x: any((
            x.endswith('jpeg'),
            x.endswith('jpg')
        ))),
        take(10)
    )

def auto_thickness(im):
    return pipe(
        im,
        np.shape,
        lambda hw: hw[0]*hw[1]*0.000002,
        int,
        lambda x: x if x > 1 else 1,
    )

def visualize(detections):
    viz_utils.visualize_boxes_and_labels_on_image_array(
      detections['image'],
      detections['detection_boxes'][0].numpy(),
      (detections['detection_classes'][0].numpy()).astype(int),
      detections['detection_scores'][0].numpy(),
      category_index,
      use_normalized_coordinates=True,
      max_boxes_to_draw=100,     
      min_score_thresh=.5,      
      line_thickness=auto_thickness(detections['image']),
      skip_scores=True,
      agnostic_mode=False
    )

detect_fn = tf.saved_model.load(os.path.join(paths['exported_model'],'saved_model'))

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    x = np.array([1,2,3]).tolist()
    return {"message": x}
  
@app.post("/detect-from-url")
async def detect_from_url(url: str = Form()):
    try:
      detections = detect(get_bytes(url))
      result = pipe(
          detections,
          lambda d: {
              'boxes': detections['detection_boxes'],
              'scores': detections['detection_scores'],
              'classes': detections['detection_classes'],
          },
          valmap(lambda x: x[0].numpy().tolist()),
      )
      return {"detections": result}
    except Exception as e:
      print(e.message, e.args)
      return {"message": "error"}

@app.post("/files/")
async def create_file(file: bytes = File()):
    return {"file_size": len(file)}


@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}