const { submitToJudge0, getJudge0Result } = require('./judge0');


async function codeOutput(code, stdin) {
  console.log("Submitted Code:", code?.slice(0, 100));
  try {
    const token = await submitToJudge0(code, 52, stdin);
    if (!token) throw new Error("No token received");

    console.log("Submission Token:", token);

    let result;
    while (true) {
      result = await getJudge0Result(token);
      if (result?.status?.id >= 3) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

    return result;
  } catch (err) {
    console.error("Error in codeOutput:", err);
    throw err;
  }
}

module.exports = codeOutput;