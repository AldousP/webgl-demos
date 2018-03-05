import * as React from 'react';
import * as BezierEasing from 'bezier-easing';
import styled from 'styled-components';
import { mat4, vec3, vec4 } from 'gl-matrix';

import breakpoints from '@app/components/styled/breakpoints';
import EditorValueInput from "@app/components/UI/editor-value-input";
import { Sequencer, SequenceType } from '@app/types/sequencer';
import { degToRad, radToDeg, isPowerOf2, randRange } from '@app/util/math';
import EditorValue from '@app/types/editor-values/interface-editor-value';
import DefaultShader from '@app/shader-wrappers/default';
import Camera from '@app/types/camera';
import Shader from '@app/types/shader';
import ObjMesh from '@app/types/obj-mesh';
import { initializeShader, setShaderData } from '@app/util/gl';
import Entity from '@app/types/entity';

const window = require( 'window' );
const document = window.document;
window.mat4 = mat4;

export type EditorConfig = {

}

type Props = {
}

type State = {

}

class ViewPort extends React.Component<Props, State> {

}

export default ViewPort;
