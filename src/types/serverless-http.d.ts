declare module "serverless-http" {
    export default function serverless(
        app: any,
        options?: any
    ): (req: any, res: any) => any;
}
