import React, { RefObject } from 'react';

interface WaveformProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const Waveform: React.FC<WaveformProps> = ({ canvasRef }) => {
  return (
    <div className="waveformContainer">
      {/* Dynamic waveform visualization */}
      <canvas 
        ref={canvasRef as RefObject<HTMLCanvasElement>}
        width={800}
        height={100}
        className="waveformCanvas"
      />
    </div>
  );
};

export default Waveform;
