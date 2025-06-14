// LayoutDebugger.js - Add this temporarily to see what's happening
import React from 'react';
import { parseContent } from './ContentParser';

const LayoutDebugger = (props) => {
  console.log('=== LAYOUT DEBUGGER ===');
  console.log('All props received:', props);
  
  const { 
    layoutType, 
    leftContent, 
    rightContent, 
    children,
    data,
    lessonData,
    progressManager,
    onQuestionComplete,
    onLessonComplete 
  } = props;

  // Test parsing if data exists
  let parseResult = null;
  if (data) {
    console.log('Raw data to parse:', data);
    parseResult = parseContent(data);
    console.log('Parse result:', parseResult);
  }

  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '3px solid red',
      backgroundColor: '#fff3cd'
    }}>
      <h2>🔍 Layout Debug Info</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Layout Type:</strong> {layoutType || 'undefined'}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Props passed:</strong>
        <ul>
          <li>leftContent: {leftContent ? '✅ provided' : '❌ not provided'}</li>
          <li>rightContent: {rightContent ? '✅ provided' : '❌ not provided'}</li>
          <li>children: {children ? '✅ provided' : '❌ not provided'}</li>
          <li>data: {data ? '✅ provided' : '❌ not provided'}</li>
          <li>lessonData: {lessonData ? '✅ provided' : '❌ not provided'}</li>
        </ul>
      </div>

      {data && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Raw Data Structure:</strong>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            fontSize: '12px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {parseResult && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Parse Results:</strong>
          <div style={{ backgroundColor: '#e8f5e8', padding: '10px', margin: '5px 0' }}>
            <strong>Left Content:</strong> {parseResult.leftContent ? '✅ found' : '❌ not found'}
          </div>
          <div style={{ backgroundColor: '#e8f5e8', padding: '10px', margin: '5px 0' }}>
            <strong>Exercise Data:</strong> {parseResult.exerciseData ? '✅ found' : '❌ not found'}
            {parseResult.exerciseData && (
              <pre style={{ fontSize: '10px', marginTop: '5px' }}>
                {JSON.stringify(parseResult.exerciseData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      }}>
        <strong>Next Steps:</strong>
        <ol>
          <li>Check if data prop is being passed correctly</li>
          <li>Verify JSON structure matches expected format</li>
          <li>Ensure parseContent function is working</li>
        </ol>
      </div>
    </div>
  );
};

export default LayoutDebugger;