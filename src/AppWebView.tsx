import React, { useRef } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import RNFetchBlob from 'rn-fetch-blob';

const AppWebView = () => {
  const webviewRef = useRef(null);

  const askStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const downloadPdf = async (url: string) => {
    const hasPermission = await askStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission', 'Storage permission is required to download file');
      return;
    }

    const { config, fs, android } = RNFetchBlob;
    const dir = fs.dirs.DownloadDir;
    const filePath = `${dir}/payslip_${Date.now()}.pdf`;

    config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'Payslip',
        description: 'Downloading payslip PDF',
        mime: 'application/pdf',
        path: filePath,
      },
    })
      .fetch('GET', url)
      .then(res => {
        android.actionViewIntent(res.path(), 'application/pdf');
      })
      .catch(() => {
        Alert.alert('Error', 'Download failed');
      });
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://your-web-app-url.com' }}
      javaScriptEnabled
      domStorageEnabled
      onFileDownload={({ nativeEvent: { downloadUrl } }) => {
        downloadPdf(downloadUrl);
      }}
    />
  );
};

export default AppWebView;
