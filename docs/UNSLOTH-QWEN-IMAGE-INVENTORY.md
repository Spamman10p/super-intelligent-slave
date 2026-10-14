# Unsloth Qwen Image model inventory

**Reviewed:** 2026-10-13  
**Host:** Bazzite GPU worker  
**Environment:** Existing `unsloth` Distrobox (Ubuntu 24.04), Unsloth 2026.10.4

## Current status

The Unsloth Studio model picker shows two usable Qwen Image 2.1 variants:

| Model | Format | Approx. size | Status | Intended use |
|---|---|---:|---|---|
| Qwen-Image-2.1 | Full model | 16 GB | Loaded and ready | Highest-quality image generation and image editing |
| Qwen-Image-2.1-GGUF | Q4_K_M | 4.2 GB | Available; can be selected/loaded | Lower-memory and faster tests |

The large model being marked **Loaded** is the authoritative readiness signal from Unsloth Studio. The smaller GGUF entry is a separate quantized variant, not a duplicate of the full model.

## Cache note

There are also cached files associated with a Qwen-Image-2.1 FP8 download. They are not currently shown as an active model in the picker and should be treated as leftover or incomplete cache until Unsloth reports the variant as complete. Do not delete or redownload cache files automatically.

Other Qwen entries in the cache are text, embedding, or audio models. They are not additional image generators.

## Planned SIS art workflow

1. Keep the full model for final character sheets, accessory sheets, edits, and inpainting.
2. Use the GGUF model for quick prompt tests and composition drafts when memory or speed matters.
3. Generate art in controlled batches using fixed prompts, seeds, dimensions, and naming.
4. Preserve the canonical SIS part IDs and catalog descriptions when generating parts or damage variants.
5. Keep Linux as the GPU generation worker. The Mac remains the project source of truth for approved assets, documentation, and website files.
6. Test one small generation before changing model files or updating the Distrobox.
7. Use a more controlled ComfyUI pipeline later if we need repeatable reference-image conditioning, batch loops, or automated variant generation.

## Safety and maintenance

- Do not install a second Ollama inside the Unsloth Distrobox.
- Do not modify or mount the protected Windows/BitLocker drive.
- Do not delete model caches to solve a catalog or UI issue.
- Record model variant, seed, prompt, and generation date for approved art.
- This inventory records status only; it does not change the Distrobox or model files.



## Verified generation test

**Date:** 2026-10-13  
**Result:** HTTP 200; one image generated successfully.

The test used the already loaded smaller model through the local Unsloth Studio API. The output was saved in the Unsloth gallery with ID `26984a8fb66f4aa2b2f52e02d48c1275`.

**Model reported by the server:** `unsloth/Qwen-Image-2.1-GGUF`  
**Quantization:** `qwen-image-2.1-Q4_K_M.gguf`  
**Workflow:** text-to-image  
**Prompt:** `clean concept sketch of a compact modular humanoid robot for the Super Intelligent Slave fictional art project, front three-quarter view, separate replaceable armor plates, simple white background, industrial pencil and ink design sheet`  
**Negative prompt:** `text, watermark, logo, blurry, extra limbs`  
**Width/height:** 256 x 256  
**Steps:** 4  
**Guidance:** 1  
**Seed:** 424242  
**Batch size:** 1  
**Live preview:** disabled

This confirms that the smaller GGUF image model is usable in the current Unsloth Distrobox and can generate SIS concept art. The larger model was not changed or unloaded during this test.

## Repeatable test procedure

1. Open the existing Unsloth Studio instance in the existing Distrobox.
2. Select either `Qwen-Image-2.1` for maximum quality or `Qwen-Image-2.1-GGUF` for lighter tests.
3. Use a fixed prompt, negative prompt, dimensions, steps, and seed.
4. Start with a 256 x 256 image and a low step count to verify the pipeline.
5. Generate one image and confirm it appears in the gallery.
6. Record the model, seed, prompt, and settings before making a batch.
7. Use the full model for final sheets and edits after the small test succeeds.

No model files, Distrobox configuration, protected drives, or Mac project assets were modified by the test.

