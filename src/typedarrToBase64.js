/**
 * 将 TypedArray、DataView、ArrayBuffer 或 Buffer 转换为 Base64。
 *
 * 支持：
 * Uint8Array、Uint16Array、Uint32Array
 * Int8Array、Int16Array、Int32Array
 * Float32Array、Float64Array
 * BigInt64Array、BigUint64Array
 * Uint8ClampedArray、DataView
 * ArrayBuffer、SharedArrayBuffer、Buffer
 *
 * @param {ArrayBuffer | SharedArrayBuffer | ArrayBufferView} input
 * @returns {string}
 */

// nodejs版本
function typedArrayToBase64(input) {
    if (input instanceof ArrayBuffer ||
        typeof SharedArrayBuffer !== 'undefined' &&
        input instanceof SharedArrayBuffer) {
        return Buffer.from(input).toString('base64');
    }

    if (ArrayBuffer.isView(input)) {
        return Buffer.from(
            input.buffer,
            input.byteOffset,
            input.byteLength
        ).toString('base64');
    }

    throw new TypeError(
        'input 必须是 TypedArray、DataView、ArrayBuffer 或 Buffer'
    );
}

// 浏览器版本
function typedArrayToBase64(input) {
    let bytes;

    if (
        input instanceof ArrayBuffer ||
        (
            typeof SharedArrayBuffer !== 'undefined' &&
            input instanceof SharedArrayBuffer
        )
    ) {
        bytes = new Uint8Array(input);
    } else if (ArrayBuffer.isView(input)) {
        bytes = new Uint8Array(
            input.buffer,
            input.byteOffset,
            input.byteLength
        );
    } else {
        throw new TypeError(
            'input 必须是 TypedArray、DataView 或 ArrayBuffer'
        );
    }

    if (
        typeof Buffer !== 'undefined' &&
        typeof Buffer.from === 'function'
    ) {
        return Buffer.from(
            bytes.buffer,
            bytes.byteOffset,
            bytes.byteLength
        ).toString('base64');
    }

    const chunkSize = 0x8000;
    const chunks = [];

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        const chunk = bytes.subarray(
            offset,
            Math.min(offset + chunkSize, bytes.length)
        );

        chunks.push(String.fromCharCode.apply(null, chunk));
    }

    return btoa(chunks.join(''));
}