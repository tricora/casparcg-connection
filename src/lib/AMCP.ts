import { Command, Transition, Ease, Direction, LogLevel, LogCategory, Chroma,
  BlendMode, Lock, Version, Producer, Consumer } from './ServerStateEnum'
// ResponseNS
import { Response as ResponseSignatureNS } from './ResponseSignature'
import { Response as ResponseValidator } from './ResponseValidators'
import { Response as ResponseParser } from './ResponseParsers'

import ResponseSignature = ResponseSignatureNS.ResponseSignature
// Command NS
import { IAMCPCommand, IAMCPCommandVO, AMCPCommand, OrChannelOrLayerCommand, ChannelCommand,
 	ChannelOrLayerCommand, LayerWithFallbackCommand, LayerWithCgFallbackCommand } from './AMCPCommand'

// Param NS
import { Param, Required as required, Optional as optional, ParamSignature, IParamSignature } from './ParamSignature'

// Validation NS
import { Validation as ParameterValidator } from './ParamValidators'
// Protocol NS
import { Depends, Coupled, OneOf, IProtocolLogic } from './ProtocolLogic'

/**
 * Internal
 */
// export class CustomCommand extends AbstractCommand {
// 	static readonly commandString = ''
// 	paramProtocol = [
// 		new ParamSignature(required, 'command', null, new ParameterValidator.StringValidator(false))
// 	]
// }

export const protocolLogic: Map<Command, IProtocolLogic[]> = new Map<Command, IProtocolLogic[]>([
	[ Command.LOADBG, [ // TODO deal with device, route, HTML
		new Depends('transitionDuration', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionEasing', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionDirection', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('stingMaskFilename', 'transition').mustBe('transition', Transition.STING),
		new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Transition.STING),
		new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Transition.STING)
	]],
	[ Command.LOAD, [ // TODO deal with device, route, HTML
		new Depends('transitionDuration', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionEasing', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionDirection', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('stingMaskFilename', 'transition').mustBe('transition', Transition.STING),
		new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Transition.STING),
		new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Transition.STING)
	]],
	[ Command.PLAY, [ // TODO deal with device, route, HTML
		new Depends('loop', 'clip'),
		new Depends('seek', 'clip'),
		new Depends('length', 'clip'),
		new Depends('filter', 'clip'),
		new Depends('transition', 'clip'),
		new Depends('transitionDuration', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionEasing', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('transitionDirection', 'transition').mustNotBe('transition', Transition.STING),
		new Depends('stingMaskFilename', 'transition').mustBe('transition', Transition.STING),
		new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Transition.STING),
		new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Transition.STING)
	]],
	[ Command.LOG_CATEGORY, [
		new OneOf('calltrace', 'communication')
	]],
	[ Command.MIXER_KEYER, [
		new Depends('defer', 'keyer')
	]],
	[ Command.MIXER_CHROMA, [
		new Coupled('threshold', 'softness'),
		new Depends('keyer', 'threshold').ifNot('keyer', Chroma.NONE),
		new Depends('spill', 'threshold'),
		new Depends('transitionDuration', 'keyer'),
		new Depends('transitionEasing', 'keyer'),
		new Depends('defer', 'threshold').ifNot('keyer', Chroma.NONE)
	]],
	[ Command.MIXER_BLEND, [
		new Depends('defer', 'blendmode')
	]],
	[ Command.MIXER_INVERT, [
		new Depends('defer', 'invert')
	]],
	[ Command.MIXER_OPACITY, [
		new Depends('transitionDuration', 'opacity'),
		new Depends('transitionEasing', 'opacity'),
		new Depends('defer', 'opacity')
	]],
	[ Command.MIXER_BRIGHTNESS, [
		new Depends('transitionDuration', 'brightness'),
		new Depends('transitionEasing', 'brightness'),
		new Depends('defer', 'brightness')
	]],
	[ Command.MIXER_SATURATION, [
		new Depends('transitionDuration', 'saturation'),
		new Depends('transitionEasing', 'saturation'),
		new Depends('defer', 'saturation')
	]],
	[ Command.MIXER_CONTRAST, [
		new Depends('transitionDuration', 'contrast'),
		new Depends('transitionEasing', 'contrast'),
		new Depends('defer', 'contrast')
	]],
	[ Command.MIXER_LEVELS, [
		new Coupled('minInput', 'maxInput', 'gamma', 'minOutput', 'maxOutput'),
		new Depends('transitionDuration', 'minInput'),
		new Depends('transitionEasing', 'minInput'),
		new Depends('defer', 'minInput')
	]],
	[ Command.MIXER_FILL, [
		new Coupled('x', 'y', 'xScale', 'yScale'),
		new Depends('transitionDuration', 'x'),
		new Depends('transitionEasing', 'x'),
		new Depends('defer', 'x')
	]],
	[ Command.MIXER_CLIP, [
		new Coupled('x', 'y', 'width', 'height'),
		new Depends('transitionDuration', 'x'),
		new Depends('transitionEasing', 'x'),
		new Depends('defer', 'x')
	]],
	[ Command.MIXER_ANCHOR, [
		new Coupled('x', 'y'),
		new Depends('transitionDuration', 'x'),
		new Depends('transitionEasing', 'x'),
		new Depends('defer', 'x')
	]],
	[ Command.MIXER_CROP, [
		new Coupled('left', 'top', 'right', 'bottom'),
		new Depends('transitionDuration', 'left'),
		new Depends('transitionEasing', 'left'),
		new Depends('defer', 'left')
	]],
	[ Command.MIXER_ROTATION, [
		new Depends('transitionDuration', 'rotation'),
		new Depends('transitionEasing', 'rotation'),
		new Depends('defer', 'rotation')
	]],
	[ Command.MIXER_PERSPECTIVE, [
		new Coupled('topLeftX', 'topLeftY', 'topRightX', 'topRightY', 'bottomRightX', 'bottomRightY', 'bottomLeftX', 'bottomLeftY'),
		new Depends('transitionDuration', 'topLeftX'),
		new Depends('transitionEasing', 'topLeftX'),
		new Depends('defer', 'topLeftX')
	]],
	[ Command.MIXER_MIPMAP, [
		new Depends('defer', 'mipmap')
	]],
	[ Command.MIXER_VOLUME, [
		new Depends('transitionDuration', 'volume'),
		new Depends('transitionEasing', 'volume'),
		new Depends('defer', 'volume')
	]],
	[ Command.MIXER_MASTERVOLUME, [
		new Depends('transitionDuration', 'mastervolume'),
		new Depends('transitionEasing', 'mastervolume'),
		new Depends('defer', 'mastervolume')
	]],
	[ Command.MIXER_STRAIGHT_ALPHA_OUTPUT, [
		new Depends('defer', 'straight_alpha_output')
	]],
	[ Command.CALL, [
		new OneOf('seek')
	]],
	[ Command.LOCK, [
		new Depends('action', 'phrase').ifNot('action', Lock.RELEASE)
	]]
])

export const paramProtocol: Map<Command, IParamSignature[]> = new Map<Command, IParamSignature[]>([
	[ Command.LOADBG, [ // TODO deal with device, route, HTML
		new ParamSignature(required, 'clip', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'loop', null, new ParameterValidator.BooleanValidatorWithDefaults('LOOP')),
		new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Transition)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Direction)),
		new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
		new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
		new ParamSignature(optional, 'seek', 'SEEK', new ParameterValidator.FrameValidator('SEEK')),
		new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
		new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
		new ParamSignature(optional, 'auto', null, new ParameterValidator.BooleanValidatorWithDefaults('AUTO')),
		new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
	]],
	[ Command.LOAD, [ // TODO deal with device, route, HTML
		new ParamSignature(required, 'clip', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'loop', null, new ParameterValidator.BooleanValidatorWithDefaults('LOOP')),
		new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Transition)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Direction)),
		new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
		new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
		new ParamSignature(optional, 'seek', 'SEEK', new ParameterValidator.FrameValidator('SEEK')),
		new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
		new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
		new ParamSignature(optional, 'auto', null, new ParameterValidator.BooleanValidatorWithDefaults('AUTO')),
		new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
	]],
	[ Command.PLAY, [ // TODO deal with device, route, HTML
		new ParamSignature(optional, 'clip', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'loop', null, new ParameterValidator.BooleanValidatorWithDefaults('LOOP')),
		new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Transition)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Direction)),
		new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
		new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
		new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
		new ParamSignature(optional, 'seek', 'SEEK', new ParameterValidator.FrameValidator('SEEK')),
		new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
		new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
		new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
	]],
	[ Command.CG_ADD, [
		new ParamSignature(required, 'flashLayer', 'ADD', new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(required, 'templateName', null, new ParameterValidator.TemplateNameValidator()),
		new ParamSignature(required, 'playOnLoad', null, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'data', null, new ParameterValidator.TemplateDataValidator())
	]],
	[ Command.CG_PLAY, [
		new ParamSignature(required, 'flashLayer', 'PLAY', new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.CG_ADD, [
		new ParamSignature(required, 'flashLayer', 'STOP', new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.CG_NEXT, [
		new ParamSignature(required, 'flashLayer', 'NEXT', new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.CG_REMOVE, [
		new ParamSignature(required, 'flashLayer', 'REMOVE', new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.CG_CLEAR, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CLEAR'))
	]],
	[ Command.CG_UPDATE, [
		new ParamSignature(required, 'flashLayer', 'UPDATE', new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(required, 'data', null, new ParameterValidator.TemplateDataValidator())
	]],
	[ Command.CG_INVOKE, [
		new ParamSignature(required, 'flashLayer', 'INVOKE', new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(required, 'method', null, new ParameterValidator.StringValidator())
	]],
	[ Command.GL_INFO, [
		new ParamSignature(required, 'info', null, new ParameterValidator.KeywordValidator('INFO')),
		new ParamSignature(optional, 'flashLayer', null, new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.LOG_LEVEL, [
		new ParamSignature(optional, 'level', null, new ParameterValidator.EnumValidator(LogLevel))
	]],
	[ Command.LOG_CATEGORY, [
		new ParamSignature(optional, 'calltrace', LogCategory.CALLTRACE, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'communication', LogCategory.COMMUNICATION, new ParameterValidator.BooleanValidatorWithDefaults(1, 0))
	]],
	[ Command.MIXER_KEYER, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('KEYER')),
		new ParamSignature(optional, 'keyer', null, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_CHROMA, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CHROMA')),
		new ParamSignature(optional, 'keyer', null, new ParameterValidator.EnumValidator(Chroma)),
		new ParamSignature(optional, 'threshold', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'softness', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'spill', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_BLEND, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('BLEND')),
		new ParamSignature(optional, 'blendmode', null, new ParameterValidator.EnumValidator(BlendMode)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_INVERT, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('INVERT')),
		new ParamSignature(optional, 'invert', null, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_OPACITY, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('OPACITY')),
		new ParamSignature(optional, 'opacity', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_BRIGHTNESS, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('BRIGHTNESS')),
		new ParamSignature(optional, 'brightness', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_SATURATION, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('SATURATION')),
		new ParamSignature(optional, 'saturation', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_CONTRAST, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CONTRAST')),
		new ParamSignature(optional, 'contrast', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_LEVELS, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('LEVELS')),
		new ParamSignature(optional, 'minInput', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'maxInput', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'gamma', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'minOutput', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'maxOutput', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_FILL, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('FILL')),
		new ParamSignature(optional, 'x', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'y', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'xScale', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'yScale', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_CLIP, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CLIP')),
		new ParamSignature(optional, 'x', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'y', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'width', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'height', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_ANCHOR, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('ANCHOR')),
		new ParamSignature(optional, 'x', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'y', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween()),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_CROP, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CROP')),
		new ParamSignature(optional, 'left', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'top', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'right', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'bottom', null, new ParameterValidator.PositiveNumberValidatorBetween(0, 1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween()),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_ROTATION, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('ROTATION')),
		new ParamSignature(optional, 'rotation', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_PERSPECTIVE, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('PERSPECTIVE')),
		new ParamSignature(optional, 'topLeftX', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'topLeftY', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'topRightX', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'topRightY', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'bottomRightX', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'bottomRightY', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'bottomLeftX', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'bottomLeftY', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.NumberValidator()),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_MIPMAP, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('MIPMAP')),
		new ParamSignature(optional, 'mipmap', null, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_VOLUME, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('VOLUME')),
		new ParamSignature(optional, 'volume', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_MASTERVOLUME, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('MASTERVOLUME')),
		new ParamSignature(optional, 'mastervolume', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_STRAIGHT_ALPHA_OUTPUT, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('STRAIGHT_ALPHA_OUTPUT')),
		new ParamSignature(optional, 'straight_alpha_output', null, new ParameterValidator.BooleanValidatorWithDefaults(1, 0)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_GRID, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('GRID')),
		new ParamSignature(optional, 'resolution', null, new ParameterValidator.PositiveNumberRoundValidatorBetween(1)),
		new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
		new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Ease)),
		new ParamSignature(optional, 'defer', null, new ParameterValidator.BooleanValidatorWithDefaults('DEFER'))
	]],
	[ Command.MIXER_COMMIT, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('COMMIT'))
	]],
	[ Command.MIXER_CLEAR, [
		new ParamSignature(required, 'keyword', null, new ParameterValidator.KeywordValidator('CLEAR'))
	]],
	[ Command.CALL, [
		new ParamSignature(optional, 'seek', 'seek', new ParameterValidator.PositiveNumberValidatorBetween(0))
	]],
	[ Command.LOCK, [
		new ParamSignature(required, 'action', null, new ParameterValidator.EnumValidator(Lock)),
		new ParamSignature(optional, 'phrase', null, new ParameterValidator.StringValidator())
	]],
	[ Command.DATA_STORE, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.DataNameValidator()),
		new ParamSignature(required, 'data', null, new ParameterValidator.TemplateDataValidator())
	]],
	[ Command.DATA_RETRIEVE, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.DataNameValidator())
	]],
	[ Command.DATA_REMOVE, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.DataNameValidator())
	]],
	[ Command.THUMBNAIL_LIST, [
		new ParamSignature(optional, 'subFolder', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.THUMBNAIL_RETRIEVE, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.THUMBNAIL_GENERATE, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.CINF, [
		new ParamSignature(required, 'fileName', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.CLS, [
		new ParamSignature(optional, 'subFolder', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.TLS, [
		new ParamSignature(optional, 'subFolder', null, new ParameterValidator.ClipNameValidator())
	]],
	[ Command.VERSION, [
		new ParamSignature(optional, 'component', null, new ParameterValidator.EnumValidator(Version))
	]],
	[ Command.INFO_DELAY, [
		new ParamSignature(required, 'delay', null, new ParameterValidator.KeywordValidator('DELAY'))
	]],
	[ Command.HELP, [
		new ParamSignature(optional, 'commands', null, new ParameterValidator.EnumValidator(Command))
	]],
	[ Command.HELP_PRODUCER, [
		new ParamSignature(optional, 'producer', null, new ParameterValidator.EnumValidator(Producer))
	]],
	[ Command.HELP_CONSUMER, [
		new ParamSignature(optional, 'consumer', null, new ParameterValidator.EnumValidator(Consumer))
	]],
	[ Command.TIME, [
		new ParamSignature(optional, 'timecode', null, new ParameterValidator.TimecodeValidator())
	]],
	[ Command.SCHEDULE_SET, [
		new ParamSignature(required, 'token', null, new ParameterValidator.StringValidator()),
		new ParamSignature(required, 'timecode', null, new ParameterValidator.TimecodeValidator()),
		new ParamSignature(required, 'command', null, new ParameterValidator.CommandValidator()) // FIXME - change this
	]],
	[ Command.SCHEDULE_REMOVE, [
		new ParamSignature(required, 'token', null, new ParameterValidator.StringValidator())
	]],
	[ Command.SCHEDULE_LIST, [
		new ParamSignature(optional, 'timecode', null, new ParameterValidator.TimecodeValidator())
	]]
])

export const responseProtocol: Map<Command, ResponseSignature> = new Map<Command, ResponseSignature>([
	[ Command.CG_INVOKE, new ResponseSignature(201) ],
	[ Command.GL_INFO, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.GLParser) ],
	[ Command.MIXER_KEYER, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusKeyerParser) ],
	[ Command.MIXER_CHROMA, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusChromaParser) ],
	[ Command.MIXER_BLEND, new ResponseSignature(201, ResponseValidator.StringValidator, ResponseParser.MixerStatusBlendParser) ],
	[ Command.MIXER_INVERT, new ResponseSignature(201, ResponseValidator.StringValidator, ResponseParser.MixerStatusInvertParser) ],
	[ Command.MIXER_OPACITY, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusOpacityParser) ],
	[ Command.MIXER_BRIGHTNESS, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusBrightnessParser) ],
	[ Command.MIXER_SATURATION, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusSaturationParser) ],
	[ Command.MIXER_CONTRAST, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusContrastParser) ],
	[ Command.MIXER_LEVELS, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusLevelsParser) ],
	[ Command.MIXER_FILL, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusFillParser) ],
	[ Command.MIXER_CLIP, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusClipParser) ],
	[ Command.MIXER_ANCHOR, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusAnchorParser) ],
	[ Command.MIXER_CROP, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusCropParser) ],
	[ Command.MIXER_ROTATION, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusRotationParser) ],
	[ Command.MIXER_PERSPECTIVE, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusPerspectiveParser) ],
	[ Command.MIXER_MIPMAP, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusMipmapParser) ],
	[ Command.MIXER_VOLUME, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusVolumeParser) ],
	[ Command.MIXER_MASTERVOLUME, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusMastervolumeParser) ],
	[ Command.MIXER_STRAIGHT_ALPHA_OUTPUT, new ResponseSignature(201, ResponseValidator.MixerStatusValidator, ResponseParser.MixerStatusStraightAlphaOutputParser) ],
	[ Command.DATA_RETRIEVE, new ResponseSignature(201, ResponseValidator.DataValidator, ResponseParser.DataParser) ],
	[ Command.DATA_LIST, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.DataListParser) ],
	[ Command.THUMBNAIL_LIST, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.ThumbnailListParser) ],
	[ Command.THUMBNAIL_RETRIEVE, new ResponseSignature(201, ResponseValidator.Base64Validator, ResponseParser.ThumbnailParser) ],
	[ Command.CINF, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.CinfParser) ],
	[ Command.CLS, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.ContentParser) ],
	[ Command.FLS, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.ContentParser) ],
	[ Command.TLS, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.ContentParser) ],
	[ Command.VERSION, new ResponseSignature(201, ResponseValidator.StringValidator, ResponseParser.VersionParser) ],
	[ Command.INFO, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.ChannelParser) ],
	// [ Command.INFO, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoParser) ],
	[ Command.INFO_TEMPLATE, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoTemplateParser) ],
	[ Command.INFO_PATHS, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoPathsParser) ],
	[ Command.INFO_CONFIG, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.ConfigParser) ],
	[ Command.INFO_SYSTEM, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoSystemParser) ],
	[ Command.INFO_SERVER, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoServerParser) ],
	[ Command.INFO_QUEUES, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoQueuesParser) ],
	[ Command.INFO_THREADS, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.InfoThreadsParser) ],
	[ Command.INFO_DELAY, new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.InfoDelayParser) ],
	[ Command.HELP, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.HelpParser) ],
	[ Command.HELP_PRODUCER, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.HelpParser) ],
	[ Command.HELP_CONSUMER, new ResponseSignature(200, ResponseValidator.ListValidator, ResponseParser.HelpParser) ],
	[ Command.TIME, new ResponseSignature(201, ResponseValidator.StringValidator, ResponseParser.InfoParser) ]
])

// FIXME: swap was not fully implemented
// FIXME: implement set
// FIXME: InfoCommand response vairies depending on whether channel is specified or not
// FIXME: Parsing ping/pong

/**
 * IInfo
 */
export namespace AMCP {

	/**
	 *
	 */
	export class InfoConfigCommand extends AbstractCommand {
		static readonly commandString = 'INFO CONFIG'
		responseProtocol = new ResponseSignature(201, ResponseValidator.XMLValidator, ResponseParser.ConfigParser)

		/**
		 *
		 */
		constructor(params: (string | Param | (string | Param)[]), context?: Object) {
			super(params, context)
		}
	}
}

/**
 * IInputOutput
 */
/* export namespace AMCP {

	export class LoadDecklinkBgCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOADBG'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'device', 'DECKLINK DEVICE', new ParameterValidator.DecklinkDeviceValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'format', 'FORMAT', new ParameterValidator.ChannelFormatValidator()),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator()),
			new ParamSignature(optional, 'auto', null, new ParameterValidator.BooleanValidatorWithDefaults('AUTO'))
		]
	}

	export class LoadDecklinkCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOAD'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'device', 'DECKLINK DEVICE', new ParameterValidator.DecklinkDeviceValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'format', 'FORMAT', new ParameterValidator.ChannelFormatValidator()),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
		]
	}

	export class PlayDecklinkCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'PLAY'
		static readonly protocolLogic = [
			new Depends('length', 'device'),
			new Depends('filter', 'device'),
			new Depends('format', 'device'),
			new Depends('channelLayout', 'device'),
			new Depends('transition', 'device'),
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'device', 'DECKLINK DEVICE', new ParameterValidator.DecklinkDeviceValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'format', 'FORMAT', new ParameterValidator.ChannelFormatValidator()),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
		]
	}

	export class LoadRouteBgCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOADBG'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'route', null, new ParameterValidator.RouteValidator()),
			new ParamSignature(optional, 'mode', null, new ParameterValidator.RouteModeValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'auto', null, new ParameterValidator.BooleanValidatorWithDefaults('AUTO')),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
		]
	}

	export class LoadRouteCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOAD'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'route', null, new ParameterValidator.RouteValidator()),
			new ParamSignature(optional, 'mode', null, new ParameterValidator.RouteModeValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
		]
	}

	export class PlayRouteCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'PLAY'
		static readonly protocolLogic = [
			new Depends('length', 'route'),
			new Depends('filter', 'route'),
			new Depends('format', 'route'),
			new Depends('channelLayout', 'route'),
			new Depends('transition', 'route'),
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'route', null, new ParameterValidator.RouteValidator()),
			new ParamSignature(optional, 'mode', null, new ParameterValidator.RouteModeValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'length', 'LENGTH', new ParameterValidator.FrameValidator('LENGTH')),
			new ParamSignature(optional, 'filter', 'FILTER', new ParameterValidator.FilterValidator()),
			new ParamSignature(optional, 'channelLayout', 'CHANNEL_LAYOUT', new ParameterValidator.ChannelLayoutValidator())
		]
	}

	export class LoadHtmlPageBgCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOADBG'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'url', '[HTML]', new ParameterValidator.URLValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator()),
			new ParamSignature(optional, 'auto', null, new ParameterValidator.BooleanValidatorWithDefaults('AUTO'))
		]
	}

	export class LoadHtmlPageCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'LOAD'
		static readonly protocolLogic = [
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(required, 'url', '[HTML]', new ParameterValidator.URLValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator())
		]
	}

	export class PlayHtmlPageCommand extends LayerWithFallbackCommand {
		static readonly commandString = 'PLAY'
		static readonly protocolLogic = [
			new Depends('transition', 'url'),
			new Depends('transitionDuration', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionEasing', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('transitionDirection', 'transition').mustNotBe('transition', Enum.Transition.STING),
			new Depends('stingMaskFilename', 'transition').mustBe('transition', Enum.Transition.STING),
			new Depends('stingDelay', 'stingMaskFilename').mustBe('transition', Enum.Transition.STING),
			new Depends('stingOverlayFilename', 'stingDelay').mustBe('transition', Enum.Transition.STING)
		]
		paramProtocol = [
			new ParamSignature(optional, 'url', '[HTML]', new ParameterValidator.URLValidator()),
			new ParamSignature(optional, 'transition', null, new ParameterValidator.EnumValidator(Enum.Transition)),
			new ParamSignature(optional, 'transitionDuration', null, new ParameterValidator.PositiveNumberValidatorBetween(0)),
			new ParamSignature(optional, 'transitionEasing', null, new ParameterValidator.EnumValidator(Enum.Ease)),
			new ParamSignature(optional, 'transitionDirection', null, new ParameterValidator.EnumValidator(Enum.Direction)),
			new ParamSignature(optional, 'stingMaskFilename', null, new ParameterValidator.ClipNameValidator()),
			new ParamSignature(optional, 'stingDelay', null, new ParameterValidator.PositiveNumberValidator()),
			new ParamSignature(optional, 'stingOverlayFilename', null, new ParameterValidator.ClipNameEmptyStringValidator())
		]
	}
} */

/**
 *
 */
export function deSerialize(cmd: IAMCPCommandVO, id: string): IAMCPCommand {

	// errror: commandstatus -1 //invalid command

	// @todo: error handling much?????? (callback??????)
	// let command: IAMCPCommand = Object.create((AMCP as any)[cmd._commandName]['prototype'])
	// command.constructor.call(command, cmd._objectParams)
	let command: IAMCPCommand = new (AMCP as any)[cmd._commandName](cmd._objectParams)
	command.populate(cmd, id)
	return command
}

/**
 *
 */
export class CasparCGSocketResponse {
	public statusCode: number
	public token: string | undefined
	public responseString: string
	public items: Array<string> = []

	/**
	 *
	 */
	constructor(responseString: string) {
		this.token = CasparCGSocketResponse.parseToken(responseString)
		this.statusCode = CasparCGSocketResponse.evaluateStatusCode(responseString)
		this.responseString = responseString
	}

	/**
	 *
	 */
	static evaluateStatusCode(responseString: string): number {
		let token = CasparCGSocketResponse.parseToken(responseString)
		let index: number
		if (token) index = token.length + 5
		else index = 0
		return parseInt(responseString.substr(index, 3), 10)
	}

	/**
	 *
	 */
	static parseToken(responseString: string): string | undefined {
		if (responseString.substr(0, 3) === 'RES') {
			return responseString.substr(4).split(' ')[0] // RES [token] RESPONSE
		} else {
			return undefined
		}
	}
}
