import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 4px;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.marginBottom || '8px'};
`;

const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`;

const SkeletonRect = styled(SkeletonBase)`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100px'};
`;

const SkeletonContainer = styled.div`
  padding: ${props => props.padding || '16px'};
  max-width: ${props => props.maxWidth || 'none'};
`;

// Predefined skeleton layouts
export const MessageSkeleton = () => (
  <SkeletonContainer>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      <SkeletonCircle size="32px" />
      <div style={{ marginLeft: '12px', flex: 1 }}>
        <SkeletonLine width="120px" height="14px" marginBottom="4px" />
        <SkeletonLine width="80px" height="12px" marginBottom="0" />
      </div>
    </div>
    <SkeletonLine width="90%" height="16px" marginBottom="6px" />
    <SkeletonLine width="75%" height="16px" marginBottom="6px" />
    <SkeletonLine width="60%" height="16px" marginBottom="0" />
  </SkeletonContainer>
);

export const UserListSkeleton = () => (
  <SkeletonContainer>
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <SkeletonCircle size="40px" />
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <SkeletonLine width="140px" height="16px" marginBottom="4px" />
          <SkeletonLine width="80px" height="12px" marginBottom="0" />
        </div>
      </div>
    ))}
  </SkeletonContainer>
);

export const RoomListSkeleton = () => (
  <SkeletonContainer>
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <SkeletonRect height="120px" />
        <div style={{ marginTop: '8px' }}>
          <SkeletonLine width="80%" height="18px" marginBottom="4px" />
          <SkeletonLine width="60%" height="14px" marginBottom="0" />
        </div>
      </div>
    ))}
  </SkeletonContainer>
);

export const EditorSkeleton = () => (
  <SkeletonContainer>
    <div style={{ marginBottom: '16px' }}>
      <SkeletonLine width="200px" height="20px" marginBottom="8px" />
      <SkeletonLine width="150px" height="14px" marginBottom="0" />
    </div>
    <SkeletonRect height="300px" />
  </SkeletonContainer>
);

export const FormSkeleton = () => (
  <SkeletonContainer maxWidth="400px">
    <SkeletonLine width="120px" height="18px" marginBottom="8px" />
    <SkeletonRect height="40px" />
    <div style={{ marginTop: '16px' }}>
      <SkeletonLine width="100px" height="18px" marginBottom="8px" />
      <SkeletonRect height="40px" />
    </div>
    <div style={{ marginTop: '20px' }}>
      <SkeletonRect height="44px" width="120px" />
    </div>
  </SkeletonContainer>
);

// Generic skeleton components
export const Skeleton = {
  Line: SkeletonLine,
  Circle: SkeletonCircle,
  Rect: SkeletonRect,
  Container: SkeletonContainer
};

export default Skeleton;