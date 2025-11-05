import postcssPxToRem from 'postcss-pxtorem'
import postcssPresetEnv from 'postcss-preset-env'

export default ({ env }) => {
  const isProd = env === 'production'

  return {
    plugins: [
      postcssPresetEnv({
        stage: 2,
        features: {
          'nesting-rules': true,
          'custom-media-queries': true,
        }
      }),
      ...(isProd ? [
        postcssPxToRem({
          propList: ['*'],
          mediaQuery: true,
        })
      ] : [])
    ]
  }
}
