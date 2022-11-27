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

<figure>
  <img src="./Loss_classification_loss.svg">
  <figcaption>Classification loss</figcaption>
</figure>
<figure>
  <img src="./Loss_localization_loss.svg">
  <figcaption>Localization loss</figcaption>
</figure>
<figure>
  <img src="./Loss_regularization_loss.svg">
  <figcaption>Regularization loss</figcaption>
</figure>
<figure>
  <img src="./Loss_total_loss.svg">
  <figcaption>Total loss</figcaption>
</figure>

## TODO

- [ ] add confusion matrix & accuracy w/ mAP