import React, { useEffect, useState } from 'react'

import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera'
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type BarcodeScannerProps = {
  visible: boolean
  onClose: () => void
  onScanned?: (data: BarcodeScanningResult) => void
}

export default function BarcodeScanner({
  visible,
  onClose,
  onScanned,
}: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    if (visible && !permission?.granted) {
      requestPermission()
    }
  }, [visible])

  if (!visible) return null

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={styles.center}>
          <Text>Đang yêu cầu quyền truy cập camera…</Text>
        </SafeAreaView>
      </Modal>
    )
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={styles.center}>
          <Text style={{ marginBottom: 12 }}>
            Bạn cần cấp quyền camera để sử dụng tính năng quét mã vạch.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Cấp quyền</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, { marginTop: 8 }]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>Đóng</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'code128', 'qr'],
          }}
          onBarcodeScanned={(result) => {
            if (onScanned) onScanned(result)
            onClose()
          }}
        />

        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 6,
  },
  closeText: { color: 'white', fontSize: 16 },
  resultBox: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultText: { color: 'white', marginBottom: 6 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  btnText: { color: 'white' },
})
