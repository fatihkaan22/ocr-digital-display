# Experiment 01

- Model: SSD MobileNet v2 320x320
- Configuration:
  - Default parameters
  - No augmentation
  - 30k iterations
- Data:
  - Synthetically generated
  - Only digits
  - Randomly placed in 512x512 canvas, with a ranging font size
  - 800 images
  - Single font (seven segment)

## Results

<img src='./Loss_classification_loss.svg' width=300/>

*Classification loss*

<img src='./Loss_localization_loss.svg' width=300/>

*Localization loss*

<img src='./Loss_regularization_loss.svg' width=300/>

*Regularization loss*

<img src='./Loss_total_loss.svg' width=300/>

*Total loss*

## Scores

```
 Average Precision  (AP) @[ IoU=0.50:0.95 | area=   all | maxDets=100 ] = 0.653
 Average Precision  (AP) @[ IoU=0.50      | area=   all | maxDets=100 ] = 0.803
 Average Precision  (AP) @[ IoU=0.75      | area=   all | maxDets=100 ] = 0.778
 Average Precision  (AP) @[ IoU=0.50:0.95 | area= small | maxDets=100 ] = 0.653
 Average Precision  (AP) @[ IoU=0.50:0.95 | area=medium | maxDets=100 ] = -1.000
 Average Precision  (AP) @[ IoU=0.50:0.95 | area= large | maxDets=100 ] = -1.000
 Average Recall     (AR) @[ IoU=0.50:0.95 | area=   all | maxDets=  1 ] = 0.472
 Average Recall     (AR) @[ IoU=0.50:0.95 | area=   all | maxDets= 10 ] = 0.695
 Average Recall     (AR) @[ IoU=0.50:0.95 | area=   all | maxDets=100 ] = 0.695
 Average Recall     (AR) @[ IoU=0.50:0.95 | area= small | maxDets=100 ] = 0.695
 Average Recall     (AR) @[ IoU=0.50:0.95 | area=medium | maxDets=100 ] = -1.000
 Average Recall     (AR) @[ IoU=0.50:0.95 | area= large | maxDets=100 ] = -1.000
INFO:tensorflow:Eval metrics at step 30000
I1203 14:31:52.428528 140070260955008 model_lib_v2.py:1015] Eval metrics at step 30000
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP: 0.653154
I1203 14:31:52.447081 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP: 0.653154
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP@.50IOU: 0.803069
I1203 14:31:52.448891 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP@.50IOU: 0.803069
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP@.75IOU: 0.777710
I1203 14:31:52.454770 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP@.75IOU: 0.777710
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP (small): 0.653155
I1203 14:31:52.460662 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP (small): 0.653155
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP (medium): -1.000000
I1203 14:31:52.462319 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP (medium): -1.000000
INFO:tensorflow:	+ DetectionBoxes_Precision/mAP (large): -1.000000
I1203 14:31:52.468289 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Precision/mAP (large): -1.000000
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@1: 0.472403
I1203 14:31:52.469891 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@1: 0.472403
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@10: 0.694858
I1203 14:31:52.478859 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@10: 0.694858
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@100: 0.695076
I1203 14:31:52.487216 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@100: 0.695076
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@100 (small): 0.695076
I1203 14:31:52.493297 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@100 (small): 0.695076
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@100 (medium): -1.000000
I1203 14:31:52.494955 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@100 (medium): -1.000000
INFO:tensorflow:	+ DetectionBoxes_Recall/AR@100 (large): -1.000000
I1203 14:31:52.502661 140070260955008 model_lib_v2.py:1018] 	+ DetectionBoxes_Recall/AR@100 (large): -1.000000
INFO:tensorflow:	+ Loss/localization_loss: 0.025106
I1203 14:31:52.503918 140070260955008 model_lib_v2.py:1018] 	+ Loss/localization_loss: 0.025106
INFO:tensorflow:	+ Loss/classification_loss: 0.119337
I1203 14:31:52.505258 140070260955008 model_lib_v2.py:1018] 	+ Loss/classification_loss: 0.119337
INFO:tensorflow:	+ Loss/regularization_loss: 0.050604
I1203 14:31:52.509625 140070260955008 model_lib_v2.py:1018] 	+ Loss/regularization_loss: 0.050604
INFO:tensorflow:	+ Loss/total_loss: 0.195047
I1203 14:31:52.511657 140070260955008 model_lib_v2.py:1018] 	+ Loss/total_loss: 0.195047
```