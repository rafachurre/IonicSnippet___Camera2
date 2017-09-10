import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { File } from '@ionic-native/file';
import { FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public statusText: string;
  public successText: any;
  public errorText: any;  

  public imageSrc: any;
  public base64Image: any;
  public filePath: string;
  public fileUri: string;
  public fileName: any;

  public apiEndPoint: string = "http://18.194.74.248:3000/api/ocr";
  public bDisableButton: boolean = true;
  public isPlatform: String;

  public options: CameraOptions;
  

  constructor(public navCtrl: NavController, public platform: Platform, public camera: Camera, public ft: FileTransfer, public file: File, public fp: FilePath) {
    let that = this;
    this.options= {
      sourceType: this.camera.PictureSourceType.CAMERA,
      //allowEdit: false,
      //encodingType: this.camera.EncodingType.JPEG,
      //targetWidth: 300,
      //targetHeight: 300,
      //mediaType: this.camera.MediaType.PICTURE,
      //correctOrientation: true,
      //saveToPhotoAlbum: false,
      //cameraDirection: this.camera.Direction.BACK
    };
    
    platform.ready().then(function(){
      if(platform.is("ios")){
        that.options.destinationType= that.camera.DestinationType.FILE_URI;
        that.isPlatform = "ios";
      }
      
      else if(platform.is("android")){
        that.options.destinationType= that.camera.DestinationType.FILE_URI;
        that.options.allowEdit=true,
        that.isPlatform = "android";
      }
      else {
        that.options.destinationType= that.camera.DestinationType.FILE_URI;
        that.isPlatform = "other";
      }

    })
  }
  
  // Option 1, get Image Path as result
  
  async takePicture(): Promise<any>{
    let that = this;
    this.statusText="openning camera..."
    /*
    let options: CameraOptions = {
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
          cameraDirection: this.camera.Direction.BACK,
      };
      */

    this.camera.getPicture(this.options).then((data: string) => {
      if (that.isPlatform === "android"){
        //that.fp.resolveNativePath(data)
        //.then(resolvedFilePath => {
          that.imageSrc=data
          //that.successText = "FilePath: " + resolvedFilePath;
        //})
        //.catch(err => that.errorText="File Path: " + err);
      }
      else {
        
        that.filePath = data;
        that.fileName = data.split("/").pop();
        that.fileUri = data.slice(0,(data.length - that.fileName.length));
        that.imageSrc = that.filePath;
      }
      this.bDisableButton=false;
    }, (err: string) => {
      console.log(err)
      that.errorText=err;
    });
    
  }

  // Option 2, get base64 data as result
  /*
  async takePicture(): Promise<any>{
    this.statusText="openning camera..."
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
  */

  uploadPressed(){
    let that = this;
    this.statusText="uploading file..."
    this.bDisableButton=true;
    let options: FileUploadOptions = {
      fileKey: 'file',
      //fileName: 'DNI.jpg',
      headers: {},
      mimeType: "image/jpeg",
      chunkedMode:true,
      httpMethod: "POST"
    }
 
    const fileTransfer = this.ft.create();

    try{
    fileTransfer.upload(this.imageSrc, this.apiEndPoint)
      .then((data) => {
        that.successText = JSON.stringify(data);
        that.bDisableButton=false;
      }, (err) => {
        that.errorText = "FileTransfer Error: " + JSON.stringify(err);
        that.bDisableButton=false;
      })
    }
    catch (err) {
      that.errorText = "FileTransfer Error: " + JSON.stringify(err);
      that.bDisableButton=false;
    }
  }
}