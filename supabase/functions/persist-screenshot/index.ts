import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { project_id, image_url } = await req.json();

    if (!project_id || !image_url) {
      return new Response(
        JSON.stringify({ success: false, error: "project_id and image_url are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Download the image
    console.log("Downloading image for project:", project_id);
    const imageResponse = await fetch(image_url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get("content-type") || "image/png";
    const ext = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
    const fileName = `${project_id}.${ext}`;

    // Upload to storage
    console.log("Uploading to storage:", fileName);
    const { error: uploadError } = await supabase.storage
      .from("project-screenshots")
      .upload(fileName, new Uint8Array(imageBuffer), {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("project-screenshots")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Update the project record
    const { error: updateError } = await supabase
      .from("projects")
      .update({ image_url: publicUrl })
      .eq("id", project_id);

    if (updateError) {
      throw new Error(`DB update failed: ${updateError.message}`);
    }

    console.log("Successfully persisted screenshot for project:", project_id);
    return new Response(
      JSON.stringify({ success: true, public_url: publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error persisting screenshot:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
