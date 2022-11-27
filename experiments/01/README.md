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

## TODO

- [ ] add confusion matrix & accuracy w/ mAP