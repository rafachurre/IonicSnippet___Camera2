import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public filePath: string;
  public fileUri: string;
  public fileName: any;
  public successText: any;
  public errorText: any;  
  public base64Image: any;

  constructor(public navCtrl: NavController, public camera: Camera) {

  }
  
  // Option 1, get Image Path as result
  /*
  async takePicture(): Promise<any>{
    let options: CameraOptions = {
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 640,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
          cameraDirection: this.camera.Direction.BACK,
      };

    this.camera.getPicture(options).then((data: string) => {
          this.filePath = data;
          this.fileName = data.split("/").pop();
          this.fileUri = data.slice(0,(data.length - this.fileName.length));
    }, (err: string) => {
      console.log(err)
      this.errorText=err;
    });
    */

  // Option 2, get base64 data as result
  async takePicture(): Promise<any>{
    let options: CameraOptions = {
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 640,
          targetHeight: 640,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
          cameraDirection: this.camera.Direction.BACK,
      };

    this.camera.getPicture(options).then((data: string) => {
      this.base64Image = 'data:image/jpeg;base64,' + data;
    }, (err: string) => {
      console.log(err)
      this.errorText=err;
    });
    
  }
}